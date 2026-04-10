"use client";

import { FC, useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppInput from "@/components/widget/Form/Input";
import api from "@/utils/api.util";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import { Edit, Trash, Plus } from "lucide-react";
import useInterfaceStore from "@/store/useInterface.store";

interface Credit {
  id: string;
  user: string;
  user_email: string;
  user_fullname: string;
  amount: number;
  note: string;
  created_at: string;
  updated_at: string;
}

const UserSearchDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchUsers();
      } else {
        setUsers([]);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await api.get(`/auth/users?search_fields=${searchTerm}`);
      if (res && res.results) {
        setUsers(res.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        Rechercher un Utilisateur
      </label>
      <input
        type="text"
        className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        placeholder="Tapez le nom, email ou phone..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          onChange(""); // reset
        }}
        onFocus={() => setIsOpen(true)}
      />
      {value && (
         <div className="mt-2 text-sm text-success">
           UUID sélectionné: {value}
         </div>
      )}
      {isOpen && (searchTerm.length >= 2 || users.length > 0) && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {loading ? (
            <div className="p-4 text-center">Chargement...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center">Aucun utilisateur trouvé</div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="cursor-pointer p-4 hover:bg-gray-2 dark:hover:bg-meta-4 border-b border-stroke dark:border-strokedark"
                onClick={() => {
                  onChange(u.id);
                  setSearchTerm(`${u.first_name || ""} ${u.last_name || ""} (${u.email})`.trim());
                  setIsOpen(false);
                }}
              >
                <div className="font-medium text-black dark:text-white">{u.first_name} {u.last_name}</div>
                <div className="text-sm font-light">{u.email} | {u.phone}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const UserCreditsPage: FC = () => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  
  const [formData, setFormData] = useState({
    id: "",
    user: "",
    amount: "" as number | string,
    note: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const { setActionResultMessage } = useInterfaceStore();

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const res: any = await api.get("/user-credit");
      if (res && res.results) {
        setCredits(res.results);
      } else {
        setCredits([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleOpenModal = (mode: "create" | "update", item?: Credit) => {
    setModalMode(mode);
    if (mode === "create") {
      setFormData({ id: "", user: "", amount: "", note: "" });
    } else if (item) {
      setFormData({ id: item.id, user: item.user, amount: item.amount, note: item.note || "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      if (modalMode === "create") {
        await api.post("/user-credit", {
          user: formData.user,
          amount: Number(formData.amount),
          note: formData.note
        });
      } else {
        await api.patch(`/user-credit/${formData.id}`, {
          amount: Number(formData.amount),
          note: formData.note
        });
      }
      setIsModalOpen(false);
      fetchCredits();
      setActionResultMessage(modalMode === "create" ? "Crédit ajouté avec succès" : "Crédit modifié avec succès", "success");
    } catch (error) {
      console.error(error);
      setActionResultMessage("Erreur lors de l'enregistrement. Vérifiez que l'UUID utilisateur est valide.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce crédit ?")) {
      try {
        await api.delete(`/user-credit/${id}`);
        fetchCredits();
        setActionResultMessage("Crédit supprimé avec succès", "success");
      } catch (error) {
        console.error(error);
        setActionResultMessage("Erreur lors de la suppression", "error");
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Crédits Utilisateurs" onClick={fetchCredits} />
      
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => handleOpenModal("create")}
          className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-80 transition duration-300"
        >
          <Plus size={20} />
          Ajouter un Crédit
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Date</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Utilisateur</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white text-right">Montant</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Note</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8">
                    <ProcessingLoader />
                  </td>
                </tr>
              ) : credits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Aucun crédit trouvé
                  </td>
                </tr>
              ) : (
                credits.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark font-medium text-black dark:text-white">
                      {item.user_fullname}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-sm">
                      {item.user_email}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark font-medium text-success text-right">
                      {item.amount.toLocaleString()} XOF
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-sm">
                      {item.note}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center justify-center space-x-3.5">
                        <button
                          onClick={() => handleOpenModal("update", item)}
                          className="hover:text-primary transition duration-300"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                          title="Supprimer"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="w-full max-w-lg rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              {modalMode === "create" ? "Ajouter un Crédit" : "Modifier le Crédit"}
            </h3>
            <form onSubmit={handleSubmit}>
              {modalMode === "create" && (
                <div className="mb-4">
                  <UserSearchDropdown
                    value={formData.user}
                    onChange={(val) => setFormData({ ...formData, user: val })}
                  />
                </div>
              )}
              <div className="mb-4">
                <AppInput
                  id="amount"
                  name="amount"
                  type="number"
                  label="Montant"
                  placeholder="Ex: 5000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value === "" ? "" : Number(e.target.value) })}
                />
              </div>
              <div className="mb-6">
                <AppInput
                  id="note"
                  name="note"
                  type="text"
                  label="Note"
                  value={formData.note}
                  placeholder="Ex: Remboursement suite à une erreur"
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded bg-bodydark1 px-4 py-2 font-medium text-black hover:bg-opacity-90 dark:bg-meta-4 dark:text-white transition duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 transition duration-300"
                >
                  {formLoading ? "Chargement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCreditsPage;
