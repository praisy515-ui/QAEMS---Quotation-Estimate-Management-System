import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brand-darkgray transition-colors focus:outline-none"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 animate-spin-slow" />
      ) : (
        <Moon className="h-5 w-5 text-brand-charcoal" />
      )}
    </button>
  );
}
