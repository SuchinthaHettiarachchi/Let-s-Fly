"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const ThemeContext = createContext<{
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
} | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    root.classList.remove("light", "dark");
    root.classList.add(mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}