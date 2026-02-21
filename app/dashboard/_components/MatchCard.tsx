"use client";

import React from "react";
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
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-700 hover:shadow-[0_8px_30px_rgba(2,6,23,0.6)]" : "bg-white border-gray-200 hover:shadow-md"}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-100 text-gray-700"}`}>
            {league}
          </span>
          <span className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>{date}, {time}</span>
        </div>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${isDark ? "bg-slate-800 text-slate-100 border-slate-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
              {team1}
            </div>
          </div>
          {isLive ? (
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              LIVE
            </div>
          ) : (
            <span className={`text-2xl font-bold ${isDark ? "text-slate-500" : "text-gray-400"}`}>VS</span>
          )}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${isDark ? "bg-slate-800 text-slate-100 border-slate-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
              {team2}
            </div>
          </div>
        </div>

        <Link
          href={createHref}
          className="block w-full text-center bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3.5 rounded-xl font-medium transition transform hover:scale-[1.02] shadow-sm"
        >
          {createLabel}
        </Link>
      </div>
    </div>
  );
}
