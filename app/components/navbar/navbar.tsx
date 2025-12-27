import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header
      className="w-full bg-[#F5F5F5]" border-b 
      
    >
      {/* (controls distance from edges) */}
      <div className="flex items-center justify-between px-12 py-4">
        {/* LEFT: Logo + Brand */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="FanUp Logo"
            width={60}
            height={60}
          />

          <span className="text-lg font-semibold">
            <span className="text-black">Fan</span>
            <span className="text-[#ef4f3f]">Up</span>
          </span>
        </div>

        {/* RIGHT: Auth actions */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-800 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="
              bg-[#ef4f3f]
              hover:bg-[#e64535]
              text-white
              px-5 py-2
              rounded-full
              text-sm
              font-medium
              transition
            "
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
