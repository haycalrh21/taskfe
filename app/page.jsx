"use client";
import Layout from "../components/layout/LayoutIndex";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "theme-ui";
import TaskManager from "@/components/page/task/TaskManager";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    <Spinner />;
    router.push("/login");
    return null; // Pastikan render berhenti di sini
  }

  return (
    <Layout
      mainContent={<TaskManager />} // Konten utama
    />
  );
}
