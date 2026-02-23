"use client";

import Link from "next/link";
import { useThemeMode } from "./useThemeMode";

interface TeamCardProps {
  league: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  teamName: string;
  points: number;
  viewHref?: string;
}

export default function TeamCard({ league, date, time, team1, team2, teamName, points, viewHref }: TeamCardProps) {
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

        <h3 className={`mb-4 text-xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>{teamName}</h3>

        <div
          className={`mb-5 rounded-2xl border px-4 py-5 ${
            isDark ? "border-slate-700 bg-slate-800/60" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-7">
            <TeamToken name={team1} isDark={isDark} />
            <span className={`text-xl font-bold ${isDark ? "text-slate-500" : "text-gray-400"}`}>VS</span>
            <TeamToken name={team2} isDark={isDark} />
          </div>
        </div>

        <div
          className={`mb-5 rounded-xl border p-3 text-center ${
            isDark ? "border-emerald-400/30 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <p className={`text-sm font-medium ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>Total Points</p>
          <p className={`text-2xl font-black ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>{points}</p>
        </div>

        {viewHref ? (
          <Link
            href={viewHref}
            className="block w-full rounded-xl bg-red-500 py-3.5 text-center font-semibold text-white transition hover:scale-[1.01] hover:bg-red-600"
          >
            View Team
          </Link>
        ) : (
          <button
            className="w-full cursor-not-allowed rounded-xl bg-red-300 py-3.5 font-semibold text-white"
            disabled
          >
            View Team
          </button>
        )}
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
