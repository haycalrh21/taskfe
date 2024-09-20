"use client";
import Layout from "@/components/layout/LayoutIndex";
import CardTask from "@/components/page/task/CardTask";
import CardSide from "@/components/page/task/CardSide";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    <Spinner />;
    return null;
  }

  if (!session) {
    // Jika tidak ada session, navigasi ke halaman login
    router.push("/login");
    return null; // Pastikan render berhenti di sini
  }

  return (
    <Layout
      mainContent={<CardTask />} // Konten utama
      sideContent={<CardSide />}
    />
  );
}
