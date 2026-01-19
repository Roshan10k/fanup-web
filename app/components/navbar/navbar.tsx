"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const handleScroll = () => {
      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActive(item.href.replace("#", ""));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between px-10 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/images/logo.png" alt="logo" width={60} height={60} />
          </Link>
          <span className="text-lg font-bold">
            <span className="text-black">Fan</span>
            <span className="text-red-500">Up</span>
          </span>
        </div>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;

            return (
              <Link
                key={item.href}
                href={`/${item.href}`}
                onClick={() => setActive(id)}
                className="relative font-medium text-gray-700 hover:text-black"
              >
                {item.label}

                {/* Red underline */}
                <span
                  className={`absolute left-0 -bottom-2 bg-red-500 transition-all duration-300 ${
                    isActive ? "w-full h-[4px]" : "w-0 h-[4px]"
                  } rounded-full`}
                />
              </Link>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium text-gray-800">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
