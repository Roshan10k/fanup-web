"use client";

import React from "react";
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
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-700 hover:shadow-[0_8px_30px_rgba(2,6,23,0.6)]" : "bg-white border-gray-200 hover:shadow-md"}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-100 text-gray-700"}`}>{league}</span>
          <span className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>{date}, {time}</span>
        </div>

        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-slate-100" : "text-gray-900"}`}>{teamName}</h3>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${isDark ? "bg-slate-800 text-slate-100 border-slate-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{team1}</div>
          </div>
          <span className={`text-2xl font-bold ${isDark ? "text-slate-500" : "text-gray-400"}`}>VS</span>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${isDark ? "bg-slate-800 text-slate-100 border-slate-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}>{team2}</div>
          </div>
        </div>

        <div className={`border rounded-xl p-3 mb-4 text-center ${isDark ? "bg-emerald-500/10 border-emerald-400/30" : "bg-green-50 border-green-200"}`}>
          <p className={`text-sm font-medium ${isDark ? "text-emerald-200" : "text-green-700"}`}>Total Points</p>
          <p className={`text-2xl font-bold ${isDark ? "text-emerald-300" : "text-green-600"}`}>{points}</p>
        </div>

        <div>
          {viewHref ? (
            <Link href={viewHref} className="block w-full text-center bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-medium transition shadow-sm">
              View Team
            </Link>
          ) : (
            <button className="w-full bg-red-300 text-white py-3.5 rounded-xl font-medium cursor-not-allowed" disabled>
              View Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
