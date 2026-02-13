"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Home, Wallet, User, Settings, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();

  const NAV_LINKS = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
    { icon: BarChart3, label: "Leaderboard", href: "/dashboard/leaderboard" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Bell, label: "Notification", href: "/notifications", badge: true },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/images/logo.png"
          alt="FanUP Logo"
          width={80}
          height={80}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
  Fan<span className="text-red-500">UP</span>
</h1>
<p className="text-sm text-gray-600">Build your dream team</p>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {NAV_LINKS.map((item) => {
          const isActive = isLinkActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl relative transition-all hover:bg-gray-50 ${
                isActive ? "bg-red-200 text-gray-900" : "text-gray-700"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-red-500" : ""} />
              <span className="font-medium text-base">{item.label}</span>

              
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500 text-red-500 hover:bg-red-50 transition w-full justify-center"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut size={20} />
          Logout
        </button>

        {/* Logout Dialog */}
        {showLogoutDialog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-80 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Confirm Logout
              </h3>
              <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-between gap-4">
                <button
                  className="flex-1 bg-gray-100 py-2 rounded-xl text-gray-700 hover:bg-gray-200 transition"
                  onClick={() => setShowLogoutDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 border border-red-500 text-red-500 py-2 rounded-xl hover:bg-red-50 transition"
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
