"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sun, Moon, Search, Menu, X } from "lucide-react";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Close sidebar after navigation
  };

  return (
    <div className="relative w-full">
      {/* Overlay to Hide Other Content When Sidebar is Open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Navbar Toggle Button (Always Visible on Small Screens) */}
      <button
        className="fixed top-4 left-4 z-50 text-gray-900 dark:text-white sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar (Initially Hidden on Small Screens) */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md w-64 sm:w-72 transition-transform transform z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:relative sm:flex`}
      >
        <div className="flex flex-col gap-4 p-6">
          {/* Title */}
          <h1 className="text-xl font-bold">Task Manager</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks By Category..."
              className="w-full p-2 pl-10 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3">
            <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/")}>🏠 Dashboard</Button>
            <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/tasks")}>📌 Tasks</Button>
            <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/projects")}>📂 Projects</Button>
            <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/profile")}>Profile</Button>
          </nav>

          {/* Theme Toggle */}
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
