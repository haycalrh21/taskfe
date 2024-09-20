"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  GithubIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";


import { useSession } from "next-auth/react";
import { getTasksUnfinished } from "../app/action/task";

const Header = ({ toggleSidebar, totalTasks }) => {
  const { data: session, status } = useSession();

  const [data, setData] = useState([]);
  const fetchData = async () => {
    // setLoading(true); // Mulai loading
    const userId = session?.user?._id;

    if (userId) {
      try {
        const response = await getTasksUnfinished(userId);
        const tasks = JSON.parse(response);
        setData(tasks.length);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        // setLoading(false); // Selesai loading
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);
  // console.log(session?.user?.email);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="md:hidden mr-2"
              onClick={toggleSidebar}
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                👋 Welcome, {session?.user?.email}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                You have {data} active tasks
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <GithubIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MoonIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <UserIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
