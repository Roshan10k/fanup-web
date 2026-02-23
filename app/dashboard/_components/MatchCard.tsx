"use client";

import Link from "next/link";
import { useThemeMode } from "./useThemeMode";

interface MatchCardProps {
  league: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  isLive?: boolean;
  createHref?: string;
  createLabel?: string;
}

export default function MatchCard({
  league,
  date,
  time,
  team1,
  team2,
  isLive,
  createHref = "/dashboard/create-team",
  createLabel = "Create Team",
}: MatchCardProps) {
  const { isDark } = useThemeMode();

  return (
    <article
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isDark
          ? "border-slate-700 bg-slate-900/95 hover:border-slate-600 hover:shadow-[0_14px_40px_-28px_rgba(15,23,42,0.95)]"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-[0_16px_38px_-28px_rgba(15,23,42,0.35)]"
      }`}
    >
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              isDark ? "bg-slate-800 text-slate-200" : "bg-gray-100 text-gray-700"
            }`}
          >
            {league}
          </span>
          <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            {date}, {time}
          </span>
        </div>

        <div
          className={`mb-6 rounded-2xl border px-4 py-5 ${
            isDark ? "border-slate-700 bg-slate-800/60" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-7">
            <TeamToken name={team1} isDark={isDark} />
            {isLive ? (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                LIVE
              </div>
            ) : (
              <span className={`text-xl font-bold ${isDark ? "text-slate-500" : "text-gray-400"}`}>VS</span>
            )}
            <TeamToken name={team2} isDark={isDark} />
          </div>
        </div>

        <Link
          href={createHref}
          className="block w-full rounded-xl bg-red-500 py-3.5 text-center font-semibold text-white transition hover:scale-[1.01] hover:bg-red-600"
        >
          {createLabel}
        </Link>
      </div>
    </article>
  );
}

function TeamToken({ name, isDark }: { name: string; isDark: boolean }) {
  return (
    <div className="text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-bold ${
          isDark
            ? "border-slate-600 bg-slate-900 text-slate-100"
            : "border-gray-300 bg-white text-gray-700"
        }`}
      >
        {name}
      </div>
    </div>
  );
}
