// components/Footer.tsx
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react"; 

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-red-950 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section: Logo + Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
          
          {/* Logo & About */}
          <div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">FanUp</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate fantasy cricket platform.<br />
              Build dream teams, compete in real-time, and win big prizes!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/signup" className="hover:text-red-400 transition-colors duration-200">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-400 transition-colors duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wide text-sm">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-6 mb-6">
              <a 
                href="https://facebook.com/fanup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="https://x.com/fanup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href="https://instagram.com/fanup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Email: <span className="text-white">support@fanup.com</span></p>
              <p>Phone: <span className="text-white">+01 123 456</span></p>
            </div>
          </div>
        </div>

        {/* Bottom section: copyright + subtle divider */}
        <div className="border-t border-red-900/40 pt-6 mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} FanUp. All rights reserved. 
          <span className="mx-2">•</span>
          Made with 🏏 Passion for Cricket
        </div>
      </div>
    </footer>
  );
}