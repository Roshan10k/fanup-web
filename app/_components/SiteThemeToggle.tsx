"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "@/app/_hooks/useThemeMode";

export default function SiteThemeToggle() {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
        isDark
          ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
