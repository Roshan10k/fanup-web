import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-gray-100 border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-12 py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
            <Image src="/images/logo.png" alt="logo" width={60} height={60}/>
            </Link>
            <span className="text-lg font-semibold">
              <span className="text-black">Fan</span>
              <span className="text-red-500">Up</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-800 hover:text-black transition">
              Login
            </Link>
            <Link href="/signup" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
  );
}
