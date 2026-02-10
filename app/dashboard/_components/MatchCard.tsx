import React from "react";

interface MatchCardProps {
  league: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  isLive?: boolean;
}

export default function MatchCard({ league, date, time, team1, team2, isLive }: MatchCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {league}
          </span>
          <span className="text-sm text-gray-500">{date}, {time}</span>
          {isLive && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">
              {team1}
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-400">VS</span>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">
              {team2}
            </div>
          </div>
        </div>

        <button className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3.5 rounded-xl font-medium transition transform hover:scale-[1.02] shadow-sm">
          Create Team
        </button>
      </div>
    </div>
  );
}
