"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "./useThemeMode";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
        isDark
          ? "border-amber-400/60 bg-slate-800 text-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.35)] hover:bg-slate-700"
          : "border-red-200 bg-red-50 text-red-600 shadow-sm hover:bg-red-100"
      }`}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-300" />
      ) : (
        <Moon size={18} className="text-red-500" />
      )}
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
