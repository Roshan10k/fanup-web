import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white border-gray-200 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between px-10 py-4"> 
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/images/logo.png" alt="logo" width={60} height={60} /> 
          </Link>
          <span className="text-lg md:text-xl font-bold"> 
            <span className="text-black">Fan</span>
            <span className="text-red-500">Up</span>
          </span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4"> 
          <Link
            href="/login"
            className="text-sm md:text-base font-medium text-gray-800 hover:text-black transition" 
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm md:text-base font-medium transition" 
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
