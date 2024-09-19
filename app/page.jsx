"use client";
import { useContext, useState } from "react";
import { UserContext } from "./server/userContext"; // Pastikan path ini benar

import { useRouter } from "next/navigation";

import Spinner from "@/components/Spinner";
import Layout from "@/components/layout/LayoutIndex";
import CardTask from "@/components/page/task/CardTask";
import CardSide from "@/components/page/task/CardSide";

export default function Home() {
  const { user, error, logout } = useContext(UserContext);
  const [totalTasks, setTotalTasks] = useState(0);
  const router = useRouter();
  if (error) {
    router.push("/login");
  }
  if (!user) return <Spinner />;

  return (
    <Layout
      mainContent={<CardTask setTotalTasks={setTotalTasks} />} // Konten utama
      sideContent={<CardSide />}
      totalTasks={totalTasks}
    />
  );
}
