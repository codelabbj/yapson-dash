"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center  bg-whiter  text-boxdark  dark:bg-boxdark-2 dark:text-white ">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Page Non trouvée</h2>
        <p className="mb-6 ">Oops! La page recherchée n&apos;existe pas.</p>
        <Link href="/">
          <span className="text-lg font-medium text-primary hover:underline">
            Page d&apos;accueil
          </span>
        </Link>
      </div>
    </div>
  );
}
