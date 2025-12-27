import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F6F0F0] text-gray-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section: Logo + Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">FanUp</h2>
            <p className="text-gray-600 text-sm">
              Your ultimate fantasy cricket platform. Build teams, compete, and win real prizes!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/signup" className="hover:text-red-500 transition">Sign Up</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-500 transition">Login</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-red-500 transition">About Us</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-red-500 transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-2">
              <a href="https://www.facebook.com" className="hover:text-blue-600 transition">Facebook</a>
              <a href="https://twitter.com" className="hover:text-cyan-600 transition">Twitter</a>
              <a href="https://instagram.com" className="hover:text-pink-600 transition">Instagram</a>
            </div>
            <p className="text-gray-600 text-sm">
              Email: support@fanup.com<br />
              Phone: +123 456 7890
            </p>
          </div>
        </div>

        {/* Bottom section: copyright */}
        <div className="border-t border-gray-300 pt-4 text-center text-gray-500 text-sm">
          © 2025 FanUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
