import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { storage } from "../utils/storage";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Bot,
  CheckSquare,
  BarChart3,
  Settings,
  Bell,
  Truck,
  Layers,
  Compass,
  Receipt,
  Sparkles,
  GitBranch,
  Cpu,
  Info,
  LogOut,
  X
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout, user } = useAuth();
  const { isDark } = useTheme();
  const [logo, setLogo] = useState(() => storage.get("qaems_logo") || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setLogo(storage.get("qaems_logo") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("logo_changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logo_changed", handleStorageChange);
    };
  }, []);

  const userRole = user?.role || "Admin";

  // Primary Navigation Group
  const primaryMenu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer", "Vendor Coordinator"] },
    { name: "Clients", path: "/customers", icon: Users, roles: ["Admin", "Interior Designer"] },
    { name: "Site Visits", path: "/site-visits", icon: Calendar, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer"] },
    { name: "Quotations", path: "/quotation-history", icon: FileText, roles: ["Admin", "Interior Designer", "Project Manager"] },
    { name: "AI Assistant", path: "/assistant", icon: Bot, roles: ["Admin", "Interior Designer"] },
    { name: "Approvals", path: "/approvals", icon: CheckSquare, roles: ["Admin", "Interior Designer", "Project Manager"] },
    { name: "Reports", path: "/reports", icon: BarChart3, roles: ["Admin", "Project Manager"] },
    { name: "Settings", path: "/settings", icon: Settings, roles: ["Admin", "Interior Designer", "Project Manager"] },
  ];

  // Secondary Navigation Group
  const secondaryMenu = [
    { name: "Notifications", path: "/notifications", icon: Bell, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer", "Vendor Coordinator"] },
    { name: "Vendors", path: "/vendors", icon: Truck, roles: ["Admin", "Project Manager", "Vendor Coordinator"] },
    { name: "Material Selection", path: "/material-selection", icon: Layers, roles: ["Admin", "Interior Designer", "Site Engineer", "Vendor Coordinator"] },
    { name: "Project Workflow", path: "/project-workflow", icon: Compass, roles: ["Admin", "Project Manager", "Site Engineer"] },
    { name: "Payments", path: "/payments", icon: Receipt, roles: ["Admin", "Project Manager"] },
    { name: "Project Demo", path: "/project-demo", icon: Sparkles, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer", "Vendor Coordinator"] },
    { name: "Architecture", path: "/architecture", icon: GitBranch, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer", "Vendor Coordinator"] },
    { name: "Tech Stack", path: "/tech-stack", icon: Cpu, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer", "Vendor Coordinator"] },
    { name: "Team Information", path: "/team-info", icon: Users, roles: ["Admin", "Interior Designer", "Project Manager", "Site Engineer", "Vendor Coordinator"] },
  ];

  const allowedPrimary = primaryMenu.filter((item) => item.roles.includes(userRole));
  const allowedSecondary = secondaryMenu.filter((item) => item.roles.includes(userRole));

  // Role Badge Style Map
  const roleColorMap = {
    "Admin": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Interior Designer": "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    "Project Manager": "bg-violet-500/10 text-violet-500 border-violet-500/20",
    "Site Engineer": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Vendor Coordinator": "bg-amber-500/10 text-amber-500 border-amber-500/20"
  };

  const badgeColor = roleColorMap[userRole] || "bg-slate-500/10 text-slate-500 border-slate-500/20";

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white text-slate-800 transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:h-screen`}
      >
        {/* Header/Logo */}
        <div className="flex h-16 items-center justify-between border-b px-6 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain rounded-md shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white font-bold text-base shrink-0">
                G
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Glory Simon
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-1 leading-none">
                Interiors - QAEMS
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-b px-6 py-4 dark:border-slate-800">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"}
            alt="User avatar"
            className="h-10 w-10 rounded-full border border-blue-500/20 object-cover shrink-0"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">{user?.name || "Glory Simon"}</span>
            <span className={`inline-block border text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 self-start uppercase tracking-wider ${badgeColor}`}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Primary Operations Section */}
          <div className="space-y-1">
            <span className="px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
              Main Operations
            </span>
            {allowedPrimary.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-sm"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? "text-blue-500"
                          : "text-slate-400 group-hover:text-blue-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Secondary Administration Group */}
          <div className="space-y-1 pt-2 border-t dark:border-slate-800/50">
            <span className="px-3 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
              Administration & Demo
            </span>
            {allowedSecondary.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-sm"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? "text-blue-500"
                          : "text-slate-400 group-hover:text-blue-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer / Logout */}
        <div className="border-t p-4 dark:border-slate-800">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
