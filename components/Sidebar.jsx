import React, { useContext } from "react";
import { Button } from "./ui/button";
import {
  BarChartIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogOut,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
  };

  return (
    <div
      className={`bg-white w-64 fixed h-full z-20 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Task Manager</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            <Link href="/"> Dashboard</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <ClipboardListIcon className="mr-2 h-4 w-4" />
            <Link href="/reference"> Reference</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <BarChartIcon className="mr-2 h-4 w-4" />
            <Link href="/analytics"> analytics</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
