import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import TourGuide from "./TourGuide";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Sub-View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 focus:outline-none">
          {children}
        </main>
      </div>

      {/* Floating guided workspace tour helper */}
      <TourGuide />
    </div>
  );
}
