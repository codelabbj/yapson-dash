"use client";

import AppButton from "@/components/widget/Form/Button";
import { useState } from "react";

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  const res = await fetch("https://api.yapson.net/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (data.access) {
    localStorage.setItem("access", data.access);
    return data.access;
  }
  return null;
}

export default function AppUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [version, setVersion] = useState("");
  const [minimalVersion, setMinimalVersion] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVersion(e.target.value);
  };

  const handleMinimalVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinimalVersion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    if (!selectedFile || !version || !minimalVersion) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("version", version);
    formData.append("minimal_version", minimalVersion);
    formData.append("apk", selectedFile);
    let token = localStorage.getItem("access");
    try {
      let res = await fetch("https://api.yapson.net/yapson/new-version", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type when using FormData
        },
      });
      let data = await res.json();

      if (data.code === "token_not_valid") {
        // Try to refresh the token
        token = await refreshAccessToken();
        if (token) {
          // Retry the upload with the new token
          res = await fetch("https://api.yapson.net/yapson/new-version", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          data = await res.json();
        } else {
          // Redirect to login if refresh fails
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/auth/signin";
          return;
        }
      }

      if (!res.ok) {
        setError(
          data.error ||
          data.message ||
          "Échec du téléchargement. Veuillez réessayer."
        );
        setLoading(false);
        return;
      }
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Échec du téléchargement. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <div className="relative max-w-xl mx-auto mt-10 bg-white dark:bg-boxdark p-8 rounded shadow">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">Télécharger l'application et les versions</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block mb-2 font-semibold">Fichier d'application (APK)</label>
          <input
            type="file"
            accept=".apk"
            onChange={handleFileChange}
            className="block w-full border bg-white dark:bg-form-input text-black dark:text-white border-gray-300 dark:border-form-strokedark rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Version</label>
          <input
            type="text"
            value={version}
            onChange={handleVersionChange}
            placeholder="ex: 12"
            className="block w-full border bg-white dark:bg-form-input text-black dark:text-white border-gray-300 dark:border-form-strokedark rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Version minimale</label>
          <input
            type="text"
            value={minimalVersion}
            onChange={handleMinimalVersionChange}
            placeholder="ex: 12"
            className="block w-full border bg-white dark:bg-form-input text-black dark:text-white border-gray-300 dark:border-form-strokedark rounded px-3 py-2"
          />
        </div>
        {/* {error && <div className="text-red-500">{error}</div>} */}
        <AppButton name={loading ? "Téléchargement..." : "Télécharger"} type="submit" width="w-full" disabled={loading} onClick={() => setLoading(false)} />
      </form>
      {response && response.message && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
          <div className="font-semibold mb-2">{response.message}</div>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">
          <div className="font-semibold mb-2">{error}</div>
        </div>
      )}
    </div>
  );
} 