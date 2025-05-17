"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Loader } from "lucide-react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("access");

    if (!token) {
      window.location.href = "auth/signin";
    }
    setLoading(false);
  }, [setLoading]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <!-- ===== Page Wrapper Start ===== --> */}
          <div className="flex ">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            {/* <!-- ===== Sidebar End ===== --> */}
            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col lg:ml-59">
              {/* <!-- ===== Header Start ===== --> */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              {/* <!-- ===== Header End ===== --> */}
              {/* <!-- ===== Main Content Start ===== --> */}
              <main>
                <div className="max-w-screen-2xl'  min-h-screen w-full bg-white p-4   dark:bg-boxdark-2 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
          {/* <!-- ===== Page Wrapper End ===== --> */}
        </>
      )}
    </>
  );
}
