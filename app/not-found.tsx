import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_48%)]" />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mb-6 overflow-hidden rounded-xl border border-white/15 bg-black/20">
          <Image
            src="/images/ChatGPT%20Image%20Feb%2028%2C%202026%2C%2004_03_09%20PM.png"
            alt="Cricket themed not found visual"
            width={720}
            height={360}
            className="h-44 w-full object-cover"
            priority
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          Page Not Found
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">404</h1>
        <p className="mt-3 text-sm text-slate-200">
          Looks like this ball went outside the boundary. The page you requested does not exist.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="w-full rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
          >
            Go to Home
          </Link>
          <Link
            href="/dashboard"
            className="w-full rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
