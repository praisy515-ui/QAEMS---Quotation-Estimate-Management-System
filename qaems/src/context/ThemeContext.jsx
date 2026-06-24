import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../utils/storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => storage.get("qaems_theme") || "light"
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    storage.set("qaems_theme", next);
  };

  const isDark = theme === "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, dark: isDark, isDark, toggleTheme }}>
      <div className={isDark ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);