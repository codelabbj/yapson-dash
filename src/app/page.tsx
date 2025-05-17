import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "./(dasboard)/dashboard/page";

export const metadata: Metadata = {
  title: "Yapson Dashboard",
  description: "",
};

export default function Home() {
  return (
    <div className="dark:bg-meta-4">
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </div>
  );
}
