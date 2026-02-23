import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const quickLinks = [
  { label: "Sign Up", href: "/signup" },
  { label: "Login", href: "/login" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0b0f1a] text-gray-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,45,78,0.22),transparent_42%)]" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">FanUp</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              The premium fantasy cricket destination for strategic players who love real competition and real rewards.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-gray-100 uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-red-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-gray-100 uppercase">Connect</h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://facebook.com/fanup"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-700 p-2.5 text-gray-300 transition hover:border-blue-400 hover:text-blue-400"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/fanup"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-700 p-2.5 text-gray-300 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/fanup"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-700 p-2.5 text-gray-300 transition hover:border-pink-400 hover:text-pink-400"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-5 space-y-1 text-sm text-gray-400">
              <p>
                Email: <span className="text-gray-100">support@fanup.com</span>
              </p>
              <p>
                Phone: <span className="text-gray-100">+01 123 456</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500 sm:text-sm">
          © {new Date().getFullYear()} FanUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
