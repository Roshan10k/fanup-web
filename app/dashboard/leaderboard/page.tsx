"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/Sidebar";

interface PodiumItemProps {
  icon: string;
  name: string;
  pts: string;
  score: string;
  position: number;
}

interface LeaderItem {
  rank: number;
  name: string;
  pts: string;
  score: string;
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  const fullName = user?.fullName || "User";

  return (
    <div className="min-h-screen flex font-['Poppins'] bg-gray-50">
      <Sidebar />

      <main className="flex-1 bg-white">
        <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Leaderboard</h2>
            <p className="text-sm text-gray-700 mt-2">
              Top Performers - Welcome {fullName.split(" ")[0]}!
            </p>
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-full">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="p-8">
          <TopThree />
          <div className="h-8" />
          <LeaderList />
        </div>
      </main>
    </div>
  );
}

function TopThree() {
  return (
    <div className="bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-2xl p-8 shadow-md max-w-4xl">
      <div className="flex justify-evenly items-end gap-6 flex-wrap md:flex-nowrap">
        <PodiumItem
          icon="person"
          name="Nishad M."
          pts="200 Pts"
          score="50.0"
          position={2}
        />
        <WinnerItem />
        <PodiumItem
          icon="military_tech"
          name="Sworup P."
          pts="199 Pts"
          score="30.0"
          position={3}
        />
      </div>
    </div>
  );
}

function WinnerItem() {
  return (
    <div className="flex flex-col items-center">
      <div className="p-5 bg-white rounded-full mb-4 shadow-sm">
        <span className="text-5xl">🏆</span>
      </div>
      <div className="px-6 py-4 bg-white rounded-2xl text-center shadow-sm">
        <p className="text-lg font-bold text-gray-900">Roshan K.</p>
        <p className="text-sm text-gray-600 mt-1">300 Pts</p>
        <p className="text-xl font-bold text-red-500 mt-2">100.0</p>
      </div>
    </div>
  );
}

function PodiumItem({ icon, name, pts, score, position }: PodiumItemProps) {
  const getIcon = () => {
    if (icon === "person") return "👤";
    if (icon === "military_tech") return "🎖️";
    return "⭐";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center mb-3">
        <span className="text-3xl">{getIcon()}</span>
      </div>
      <div className="px-5 py-3 bg-white bg-opacity-40 rounded-2xl text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-700 mt-1">{pts}</p>
        <p className="text-base font-bold text-red-500 mt-1">{score}</p>
        <p className="text-xs text-gray-600 mt-1">#{position}</p>
      </div>
    </div>
  );
}

function LeaderList() {
  const leaders: LeaderItem[] = Array.from({ length: 5 }, (_, index) => ({
    rank: index + 4,
    name: "Player Name",
    pts: "150 Pts",
    score: "20.0",
  }));

  return (
    <div className="max-w-4xl">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Other Rankings</h3>
      <div className="space-y-3">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="p-5 bg-gray-50 rounded-2xl shadow-sm flex items-center hover:shadow-md transition-shadow"
          >
            <div className="text-lg font-bold text-gray-900 mr-5 min-w-[40px]">
              {leader.rank}.
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900">
                {leader.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">{leader.pts}</p>
            </div>
            <div className="text-lg font-bold text-red-500">{leader.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
