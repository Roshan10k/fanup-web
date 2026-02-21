"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "fanup-theme";
const THEME_EVENT_NAME = "fanup-theme-change";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }
      if (event.newValue === "dark" || event.newValue === "light") {
        setTheme(event.newValue);
      }
    };

    const onThemeEvent = () => {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(THEME_EVENT_NAME, onThemeEvent);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(THEME_EVENT_NAME, onThemeEvent);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT_NAME));
    setTheme(nextTheme);
  }, [theme]);

  return { theme, isDark, toggleTheme };
}
