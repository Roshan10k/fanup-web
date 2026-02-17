"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, CalendarDays, Plus, Target, Trophy, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./_components/Sidebar";
import MatchCard from "./_components/MatchCard";
import TeamCard from "./_components/TeamCard";
import { encodeSelectedIds, SAVED_TEAMS_STORAGE_KEY, type SavedTeam } from "./create-team/teamBuilder";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upcoming" | "myteams">("upcoming");
  const [savedTeams] = useState<SavedTeam[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = localStorage.getItem(SAVED_TEAMS_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as SavedTeam[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const fullName = user?.fullName || "User";
  const balance = user?.balance ?? 0;

  const upcomingMatches = [
    { id: 1, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 2, league: "NPL", date: "4th Nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: false },
    { id: 3, league: "NPL", date: "5th Nov, 26", time: "7:00 PM", team1: "PAK", team2: "SA", isLive: false },
    { id: 4, league: "NPL", date: "6th Nov, 26", time: "1:00 PM", team1: "ENG", team2: "NZ", isLive: false },
    { id: 5, league: "NPL", date: "7th Nov, 26", time: "3:15 PM", team1: "IND", team2: "SL", isLive: false },
  ];

  const tabFromQuery = searchParams.get("tab");
  const resolvedActiveTab =
    tabFromQuery === "myteams" || tabFromQuery === "upcoming" ? tabFromQuery : activeTab;
  const allMyTeams = savedTeams;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex font-['Poppins'] bg-gray-50">
      <Sidebar />

      <main className="flex-1 bg-white">
        <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-700 mt-2">Welcome back {fullName.split(" ")[0]}! Ready to build today&apos;s winning team?</p>
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-full" aria-label="Notifications">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="p-8 max-w-7xl space-y-7">
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-3xl border border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-8">
              <p className="text-sm font-semibold text-gray-700">Available Credit</p>
              <p className="text-6xl font-bold text-gray-900 mt-2">{balance.toFixed(1)}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="bg-white text-red-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Credit
                </button>
                <Link
                  href="/dashboard/wallet"
                  className="px-6 py-3 rounded-xl border border-orange-200 bg-white/70 text-gray-700 font-medium hover:bg-white transition"
                >
                  Open Wallet
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Quick Snapshot</h3>
              <div className="mt-4 space-y-3">
                <StatItem icon={<Users className="w-4 h-4 text-blue-500" />} label="My Teams" value={String(allMyTeams.length)} />
                <StatItem icon={<CalendarDays className="w-4 h-4 text-orange-500" />} label="Upcoming Matches" value={String(upcomingMatches.length)} />
                <StatItem icon={<Target className="w-4 h-4 text-green-500" />} label="Avg Points" value={allMyTeams.length ? String(Math.round(allMyTeams.reduce((acc, team) => acc + team.points, 0) / allMyTeams.length)) : "0"} />
                <StatItem icon={<Trophy className="w-4 h-4 text-yellow-600" />} label="Best Score" value={allMyTeams.length ? String(Math.max(...allMyTeams.map((team) => team.points))) : "0"} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                resolvedActiveTab === "upcoming"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upcoming Matches
            </button>
            <button
              onClick={() => setActiveTab("myteams")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                resolvedActiveTab === "myteams"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Teams
            </button>
          </section>

          {resolvedActiveTab === "upcoming" ? (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => <MatchCard key={match.id} {...match} />)}
            </section>
          ) : allMyTeams.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allMyTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  league={team.league}
                  date={team.date}
                  time={team.time}
                  team1={team.team1}
                  team2={team.team2}
                  teamName={team.teamName}
                  points={team.points}
                  viewHref={`/dashboard/create-team/preview?selected=${encodeSelectedIds(team.playerIds)}&teamName=${encodeURIComponent(team.teamName)}&teamId=${team.id}&readonly=1`}
                  editHref={`/dashboard/create-team?selected=${encodeSelectedIds(team.playerIds)}&teamName=${encodeURIComponent(team.teamName)}&teamId=${team.id}`}
                />
              ))}
            </section>
          ) : (
            <section className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <p className="text-xl font-bold text-gray-900 mb-2">No Teams Yet</p>
              <p className="text-sm text-gray-600">Create a team from upcoming matches to start competing.</p>
              <Link
                href="/dashboard/create-team"
                className="mt-5 inline-flex px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Create Team
              </Link>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}
