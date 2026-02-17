import React from "react";
import Link from "next/link";

interface TeamCardProps {
  league: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  teamName: string;
  points: number;
  viewHref?: string;
  editHref?: string;
}

export default function TeamCard({ league, date, time, team1, team2, teamName, points, viewHref, editHref }: TeamCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{league}</span>
          <span className="text-sm text-gray-500">{date}, {time}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">{teamName}</h3>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">{team1}</div>
          </div>
          <span className="text-2xl font-bold text-gray-400">VS</span>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">{team2}</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center">
          <p className="text-sm text-green-700 font-medium">Total Points</p>
          <p className="text-2xl font-bold text-green-600">{points}</p>
        </div>

        <div className="flex gap-3">
          {viewHref ? (
            <Link href={viewHref} className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-medium transition shadow-sm">
              View Team
            </Link>
          ) : (
            <button className="flex-1 bg-red-300 text-white py-3.5 rounded-xl font-medium cursor-not-allowed" disabled>
              View Team
            </button>
          )}

          {editHref ? (
            <Link href={editHref} className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium transition">
              Edit
            </Link>
          ) : (
            <button className="flex-1 bg-gray-100 text-gray-400 py-3.5 rounded-xl font-medium cursor-not-allowed" disabled>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
