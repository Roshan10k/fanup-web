"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside
      className="fixed md:static top-0 left-0 h-screen w-64 border-r z-40"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E0E0E0",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Logo */}
      <div
        className="p-4 border-b"
        style={{ borderColor: "#E0E0E0" }}
      >
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <span
            className="font-semibold"
            style={{ color: "#333333" }}
          >
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-2">
        {ADMIN_LINKS.map(link => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-sm font-medium transition"
              style={{
                borderRadius: "20px",
                backgroundColor: active ? "#FE304C" : "transparent",
                color: active ? "#FFFFFF" : "#777777",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
