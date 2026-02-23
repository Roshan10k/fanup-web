"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavbarProps = {
  variant?: "landing" | "auth";
  authMode?: "login" | "signup";
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ variant = "landing", authMode }: NavbarProps) {
  const [active, setActive] = useState<string>("about");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant !== "landing") return;

    const handleScroll = () => {
      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(item.href.replace("#", ""));
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const renderNavLink = (label: string, href: string, mobile = false) => {
    const id = href.replace("#", "");
    const isActive = active === id;

    return (
      <Link
        key={href}
        href={href}
        onClick={() => {
          setActive(id);
          setMenuOpen(false);
        }}
        className={
          mobile
            ? `rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border border-red-200 bg-red-100 text-red-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            : `rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border border-red-200 bg-red-100 text-red-700"
                  : "text-gray-500 hover:bg-white hover:text-gray-900"
              }`
        }
      >
        {label}
      </Link>
    );
  };

  const authButtonClass = (mode: "login" | "signup") => {
    if (authMode === mode) {
      return "border border-red-200 bg-red-100 text-red-700";
    }

    if (mode === "login") {
      return "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900";
    }

    return "bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:from-red-600 hover:via-rose-600 hover:to-orange-600";
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="relative overflow-hidden border-b border-gray-200/80 bg-white/95 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.8)] backdrop-blur-xl">
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-red-50/70 to-transparent" />

        <div className="relative flex items-center justify-between px-3 py-3 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="FanUp logo" width={48} height={48} />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Fan</span>
              <span className="text-red-500">Up</span>
            </span>
          </Link>

          {variant === "landing" && (
            <div className="hidden md:flex">
              <div className="flex items-center gap-1 rounded-full border border-gray-300/80 bg-gray-100 p-1.5">
                {navItems.map((item) => renderNavLink(item.label, item.href))}
              </div>
            </div>
          )}

          <div className="hidden items-center gap-2.5 md:flex">
            <Link href="/login" className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${authButtonClass("login")}`}>
              Login
            </Link>
            <Link href="/signup" className={`rounded-full px-5 py-2 text-sm font-semibold transition ${authButtonClass("signup")}`}>
              Sign Up
            </Link>
          </div>

          {variant === "landing" ? (
            <button
              type="button"
              className="inline-flex rounded-xl border border-gray-200 bg-white p-2 text-gray-700 md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : (
            <div className="flex items-center gap-2.5 md:hidden">
              <Link href="/login" className={`rounded-full px-4 py-2 text-xs font-semibold transition ${authButtonClass("login")}`}>
                Login
              </Link>
              <Link href="/signup" className={`rounded-full px-4 py-2 text-xs font-semibold transition ${authButtonClass("signup")}`}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {variant === "landing" && menuOpen && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-3 md:hidden">
            <div className="mb-4 flex flex-col gap-2">{navItems.map((item) => renderNavLink(item.label, item.href, true))}</div>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-full bg-red-500 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
