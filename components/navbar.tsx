"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sun, Moon, User, Search, Menu, X } from "lucide-react";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const router = useRouter();

  return (
    <aside className="fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md w-64 sm:w-72 transition-all">
      {/* Navbar Toggle Button (Mobile) */}
      <button 
        className="absolute top-4 right-4 sm:hidden text-gray-900 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Content (Visible only when open on mobile) */}
      <div className={`flex flex-col gap-4 p-6 ${isOpen ? "block" : "hidden"} sm:block`}>
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
          <Button variant="ghost" className="justify-start" onClick={()=>router.push("/")}>🏠 Dashboard</Button>
          <Button variant="ghost" className="justify-start">📌 Tasks</Button>
          <Button variant="ghost" className="justify-start">📂 Projects</Button>
          <Button variant="ghost" className="justify-start">Profile</Button>
        </nav>

        {/* Theme Toggle & Profile */}
        <div className=" mt-4 bottom-8 left-0 min-w-fit flex flex-col gap-3 ">
          <Button 
            variant="ghost" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </Button>
          
         
        </div>
      </div>
    </aside>
  );
}
