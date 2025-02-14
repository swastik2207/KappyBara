"use client";

import { useTheme } from "next-themes";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 text-center bg-gray-100 dark:bg-gray-900 dark:text-white shadow-md">
      <p className="text-sm">&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {theme === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled"}
      </p>
    </footer>
  );
}
