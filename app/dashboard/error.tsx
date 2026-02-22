"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-gray-600">
          We could not load this dashboard page right now.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
