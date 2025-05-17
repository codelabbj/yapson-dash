"use client";
//import "jsvectormap/dist/jsvectormap.css";
//import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import useLocalStorage from "@/hooks/useLocalStorage";
import React, { useEffect, useLayoutEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed fetchData from the dependency array
  const [colorMode] = useLocalStorage("color-theme", "light");

  useLayoutEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode]);
  return (
    <html
      lang="fr"
      className=" bg-whiter  text-boxdark  dark:bg-boxdark-2 dark:text-white "
    >
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>
      </body>
    </html>
  );
}
