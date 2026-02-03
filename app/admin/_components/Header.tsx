"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "#F5F5F5",
        borderColor: "#E0E0E0",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          
          
            <span>
              
            </span>
          

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <span
              className="text-sm"
              style={{ color: "#777777" }}
            >
              {user?.email || "Admin"}
            </span>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-semibold text-white transition"
              style={{
                backgroundColor: "#FE304C",
                borderRadius: "30px",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.backgroundColor = "#E74C3C")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.backgroundColor = "#FE304C")
              }
            >
              Logout
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
}
