"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Home, Wallet, User, Settings, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useThemeMode } from "./useThemeMode";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { isDark } = useThemeMode();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();

  const NAV_LINKS = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: BarChart3, label: "Leaderboard", href: "/dashboard/leaderboard" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
  ];

  const META_LINKS = [
    { icon: Bell, label: "Notification", href: "/notifications", badge: true },
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

  return (
    <aside className={`w-72 h-screen p-5 flex flex-col sticky top-0 border-r ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-gray-200"}`}>
      <div className={`rounded-2xl border p-4 mb-4 ${isDark ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" : "border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100"}`}>
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="FanUP Logo" width={56} height={56} className="rounded-xl" />
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              Fan<span className="text-red-500">UP</span>
            </h1>
            <p className={`text-xs ${isDark ? "text-slate-300" : "text-gray-700"}`}>Build your dream team</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="px-2 pb-2">
          <p className={`text-[11px] tracking-[0.12em] font-semibold uppercase ${isDark ? "text-slate-400" : "text-gray-400"}`}>Main</p>
        </div>
        <nav className="space-y-1.5">
          {NAV_LINKS.map((item) => {
            const isActive = isLinkActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl relative border transition-all ${
                  isActive
                    ? isDark
                      ? "bg-red-500/15 text-slate-100 border-red-400/30"
                      : "bg-red-50 text-gray-900 border-red-100"
                    : isDark
                      ? "text-slate-300 border-transparent hover:bg-slate-800 hover:border-slate-700"
                      : "text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-red-500" />}
                <item.icon size={20} className={isActive ? "text-red-500" : isDark ? "text-slate-400" : "text-gray-500"} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 px-2 pb-2">
          <p className={`text-[11px] tracking-[0.12em] font-semibold uppercase ${isDark ? "text-slate-400" : "text-gray-400"}`}>System</p>
        </div>
        <nav className="space-y-1.5">
          {META_LINKS.map((item) => {
            const isActive = isLinkActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl relative border transition-all ${
                  isActive
                    ? isDark
                      ? "bg-red-500/15 text-slate-100 border-red-400/30"
                      : "bg-red-50 text-gray-900 border-red-100"
                    : isDark
                      ? "text-slate-300 border-transparent hover:bg-slate-800 hover:border-slate-700"
                      : "text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-red-500" : isDark ? "text-slate-400" : "text-gray-500"} />
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge ? <span className="ml-auto w-2 h-2 rounded-full bg-red-500" /> : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`pt-3 mt-3 border-t ${isDark ? "border-slate-800" : "border-gray-200"}`}>
        <div className={`rounded-2xl border p-3 mb-3 flex items-center gap-3 ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isDark ? "bg-slate-800 text-slate-100" : "bg-gray-100 text-gray-700"}`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate ${isDark ? "text-slate-100" : "text-gray-900"}`}>{user?.fullName || "User"}</p>
            <p className={`text-xs truncate ${isDark ? "text-slate-400" : "text-gray-500"}`}>{user?.email || "user@example.com"}</p>
          </div>
        </div>

        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition w-full justify-center font-medium ${
            isDark
              ? "border-red-400/35 bg-red-500/10 text-red-300 hover:bg-red-500/20"
              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut size={18} />
          Logout
        </button>

        {showLogoutDialog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-6 w-full max-w-sm ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-slate-100" : "text-gray-900"}`}>Confirm Logout</h3>
              <p className={`text-sm mb-6 ${isDark ? "text-slate-300" : "text-gray-600"}`}>Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button
                  className={`flex-1 py-2.5 rounded-xl transition ${isDark ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => setShowLogoutDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 border py-2.5 rounded-xl transition ${isDark ? "border-red-400/50 text-red-300 hover:bg-red-500/10" : "border-red-500 text-red-500 hover:bg-red-50"}`}
                  onClick={async () => {
                    setShowLogoutDialog(false);
                    await logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
