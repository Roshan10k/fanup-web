"use client";

import Image from "next/image";
import Link from "next/link";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_45%)]" />

      <div className="relative w-full max-w-lg rounded-2xl border border-red-300/25 bg-slate-900/75 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mb-6 overflow-hidden rounded-xl border border-white/15 bg-white/5">
          <Image
            src="/images/cricket-umpire-giving-decision-player-is-out-clipart.jpg"
            alt="Cricket umpire out decision"
            width={720}
            height={360}
            className="h-44 w-full object-contain bg-white/5"
            priority
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
          Match Interrupted
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">Unexpected Error</h1>
        <p className="mt-3 text-sm text-slate-200">
          The umpire has paused this page due to an unexpected issue.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
          >
            Retry
          </button>
          <Link
            href="/"
            className="w-full rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
