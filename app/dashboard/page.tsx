"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./_components/Sidebar";
import MatchCard from "./_components/MatchCard";
import TeamCard from "./_components/TeamCard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"upcoming" | "myteams">("upcoming");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>
    );
  }

  const fullName = user?.fullName || "User";
  const balance = user?.balance ?? 0;

  const upcomingMatches = [
    { id: 1, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 2, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: false },
    { id: 3, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: false },
    { id: 4, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: false },
    { id: 5, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: false },
  ];

  const myTeams = [
    { id: 1, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", teamName: "Team Warriors", points: 850 },
    { id: 2, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", teamName: "Dream XI", points: 920 },
  ];

  return (
    <div className="min-h-screen flex font-['Poppins'] bg-gray-50">
      <Sidebar />

      <main className="flex-1 bg-white">
        <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-700 mt-2">Welcome back {fullName.split(" ")[0]}!</p>
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-full">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="p-8">
          <div className="bg-gradient-to-br from-yellow-300 via-orange-300 to-orange-400 rounded-2xl p-8 mb-8 shadow-md max-w-2xl">
            <p className="text-sm font-medium mb-2 text-gray-800">Available credit</p>
            <p className="text-5xl font-bold mb-6 text-gray-900">{balance.toFixed(1)}</p>
            <button className="bg-white text-red-500 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm">Add Credit</button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-4 font-bold text-lg relative transition ${activeTab === "upcoming" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Upcoming Matches
              {activeTab === "upcoming" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>}
            </button>
            <button
              onClick={() => setActiveTab("myteams")}
              className={`pb-4 font-bold text-lg relative transition ${activeTab === "myteams" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              My Teams
              {activeTab === "myteams" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>}
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {activeTab === "upcoming"
              ? upcomingMatches.map((match) => <MatchCard key={match.id} {...match} />)
              : myTeams.map((team) => <TeamCard key={team.id} {...team} />)}
          </div>
        </div>
      </main>
    </div>
  );
}
