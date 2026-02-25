"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Home, Wallet, User, Settings, LogOut, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "./useThemeMode";
import { getUnreadCountAction } from "@/app/lib/action/notification_action";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { isDark } = useThemeMode();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const result = await getUnreadCountAction();
      if (result.success && result.data) {
        setUnreadCount(result.data.count);
      }
    };
    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const NAV_LINKS = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: BarChart3, label: "Leaderboard", href: "/dashboard/leaderboard" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ];

  const META_LINKS = [
    { icon: Bell, label: "Notification", href: "/dashboard/notifications", badge: unreadCount > 0, badgeCount: unreadCount },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const initials = useMemo(() => {
    const source = (user?.fullName || user?.email || "User").trim();
    return source
      .split(" ")
      .filter(Boolean)
      .map((chunk: string) => chunk[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.email, user?.fullName]);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const renderNavItem = (
    item: { icon: LucideIcon; label: string; href: string; badge?: boolean; badgeCount?: number },
    section: "main" | "meta",
  ) => {
    const isActive = isLinkActive(item.href);
    return (
      <Link
        key={`${section}-${item.label}`}
        href={item.href}
        className={`group relative flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-200 ${
          isActive
            ? isDark
              ? "border-red-400/35 bg-gradient-to-r from-red-500/18 via-red-500/10 to-transparent text-slate-100 shadow-[0_10px_28px_-18px_rgba(248,113,113,0.85)]"
              : "border-red-200 bg-gradient-to-r from-red-50 via-red-50 to-orange-50 text-gray-900 shadow-[0_10px_24px_-16px_rgba(239,68,68,0.5)]"
            : isDark
              ? "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/80"
              : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50"
        }`}
      >
        {isActive && (
          <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${isDark ? "bg-red-400" : "bg-red-500"}`} />
        )}
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border transition ${
            isActive
              ? isDark
                ? "border-red-400/40 bg-red-500/15"
                : "border-red-200 bg-white"
              : isDark
                ? "border-slate-700 bg-slate-900 group-hover:border-slate-600"
                : "border-gray-200 bg-white group-hover:border-gray-300"
          }`}
        >
          <item.icon
            size={17}
            className={
              isActive ? (isDark ? "text-red-300" : "text-red-500") : isDark ? "text-slate-400" : "text-gray-500"
            }
          />
        </span>
        <span className="text-sm font-semibold tracking-tight">{item.label}</span>
        {item.badge && item.badgeCount && item.badgeCount > 0 ? (
          <span
            className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
              isDark ? "bg-red-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {item.badgeCount > 99 ? "99+" : item.badgeCount}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <>
    <aside
      className={`sticky top-0 flex h-screen w-[19rem] shrink-0 flex-col border-r p-4 ${
        isDark
          ? "border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.08),transparent_40%),#020617]"
          : "border-gray-200 bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.12),transparent_42%),#ffffff]"
      }`}
    >
      <div className="mb-4 px-1">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="FanUP Logo" width={46} height={46} className="rounded-xl" />
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              Fan<span className="text-red-500">UP</span>
            </h1>
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              Build your dream team
            </p>
          </div>
        </div>
      </div>
      <div className={`mb-4 h-px ${isDark ? "bg-slate-800" : "bg-gray-200"}`} />

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        <section>
          <p className={`mb-2 px-1 text-[11px] font-bold tracking-[0.18em] uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            Main
          </p>
          <nav className="space-y-1.5">{NAV_LINKS.map((item) => renderNavItem(item, "main"))}</nav>
        </section>

        <section>
          <p className={`mb-2 px-1 text-[11px] font-bold tracking-[0.18em] uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            System
          </p>
          <nav className="space-y-1.5">{META_LINKS.map((item) => renderNavItem(item, "meta"))}</nav>
        </section>
      </div>

      <div className={`mt-4 border-t pt-4 ${isDark ? "border-slate-800" : "border-gray-200"}`}>
        <div
          className={`mb-3 rounded-2xl border p-3.5 ${
            isDark ? "border-slate-700 bg-slate-900/80" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${
                isDark ? "bg-slate-800 text-slate-100" : "bg-gray-100 text-gray-700"
              }`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className={`truncate text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                {user?.fullName || "User"}
              </p>
              <p className={`truncate text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        <button
          className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            isDark
              ? "border-red-400/35 bg-red-500/10 text-red-300 hover:bg-red-500/20"
              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>
    </aside>
    {showLogoutDialog && createPortal(
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        onClick={() => setShowLogoutDialog(false)}
      >
        <div
          className={`w-full max-w-md rounded-xl overflow-hidden border shadow-2xl ${
            isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative px-6 py-6 bg-gradient-to-r from-red-500 to-rose-600 text-white">
            <button
              type="button"
              onClick={() => setShowLogoutDialog(false)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Confirm Logout</h3>
                <p className="text-sm text-white/90">End your session now?</p>
              </div>
            </div>
          </div>

          <div className={`px-6 py-5 ${isDark ? "bg-slate-900" : "bg-white"}`}>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              You will be redirected to login and need to sign in again.
            </p>
          </div>

          <div className={`px-6 py-4 border-t flex justify-end gap-3 ${
            isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
          }`}>
            <button
              type="button"
              onClick={() => setShowLogoutDialog(false)}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                isDark
                  ? "border-slate-600 text-slate-200 hover:bg-slate-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                setShowLogoutDialog(false);
                await logout();
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
