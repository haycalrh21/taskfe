"use client";
import { useState } from "react";

import Header from "../Header";
import Sidebar from "../Sidebar";

export default function Layout({ mainContent, sideContent, totalTasks }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} totalTasks={totalTasks} />

        <main
          className="flex-1 overflow-x-hidden overflow-y-auto"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main content */}
              <div className="w-full lg:w-3/4">{mainContent}</div>

              {/* Side content */}
              <div className="w-full lg:w-1/4">{sideContent}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
