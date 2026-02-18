"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CalendarDays, Plus, Target, Trophy, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./_components/Sidebar";
import MatchCard from "./_components/MatchCard";
import TeamCard from "./_components/TeamCard";
import { encodeSelectedIds, SAVED_TEAMS_STORAGE_KEY, type SavedTeam } from "./create-team/teamBuilder";

interface ApiMatch {
  _id: string;
  league?: string;
  startTime: string;
  status?: string;
  teamA?: { shortName?: string };
  teamB?: { shortName?: string };
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upcoming" | "myteams">("upcoming");
  const [completedMatches, setCompletedMatches] = useState<
    Array<{
      id: string;
      league: string;
      date: string;
      time: string;
      team1: string;
      team2: string;
      isLive: boolean;
      createHref: string;
    }>
  >([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState<string | null>(null);
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

  useEffect(() => {
    let isMounted = true;

    const loadCompletedMatches = async () => {
      setMatchesLoading(true);
      setMatchesError(null);

      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:3001";
        const response = await fetch(
          `${API_BASE_URL}/api/matches/completed?page=1&size=12`,
          {
            cache: "no-store",
          }
        );

        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Failed to load matches");
        }

        const rows: ApiMatch[] = Array.isArray(payload?.data) ? payload.data : [];
        const mapped = rows.map((match) => {
          const startTime = new Date(match.startTime);
          const league = String(match.league || "League");
          const date = startTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          });
          const time = startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });
          const team1 = String(match.teamA?.shortName || "T1");
          const team2 = String(match.teamB?.shortName || "T2");
          return {
            id: String(match._id),
            league,
            date,
            time,
            team1,
            team2,
            isLive: match.status === "live",
            createHref: `/dashboard/create-team?matchId=${encodeURIComponent(String(match._id))}&league=${encodeURIComponent(league)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`,
          };
        });

        if (isMounted) {
          setCompletedMatches(mapped);
        }
      } catch (error) {
        if (isMounted) {
          setMatchesError(
            error instanceof Error ? error.message : "Failed to load matches"
          );
        }
      } finally {
        if (isMounted) {
          setMatchesLoading(false);
        }
      }
    };

    void loadCompletedMatches();
    return () => {
      isMounted = false;
    };
  }, []);

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
                <StatItem icon={<CalendarDays className="w-4 h-4 text-orange-500" />} label="Matches" value={String(completedMatches.length)} />
                <StatItem icon={<Target className="w-4 h-4 text-green-500" />} label="Avg Points" value={allMyTeams.length ? String(Math.round(allMyTeams.reduce((acc, team) => acc + team.points, 0) / allMyTeams.length)) : "0"} />
                <StatItem icon={<Trophy className="w-4 h-4 text-yellow-600" />} label="Best Score" value={allMyTeams.length ? String(Math.max(...allMyTeams.map((team) => team.points))) : "0"} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-2 inline-flex gap-2">
            <button
              onClick={() => {
                setActiveTab("upcoming");
                router.replace("/dashboard?tab=upcoming");
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                resolvedActiveTab === "upcoming"
                  ? "bg-red-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upcoming Matches
            </button>
            <button
              onClick={() => {
                setActiveTab("myteams");
                router.replace("/dashboard?tab=myteams");
              }}
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
              {matchesLoading ? (
                <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                  Loading matches...
                </div>
              ) : matchesError ? (
                <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                  {matchesError}
                </div>
              ) : completedMatches.length > 0 ? (
                completedMatches.map((match) => <MatchCard key={match.id} {...match} />)
              ) : (
                <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                  No matches available.
                </div>
              )}
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
                  viewHref={`/dashboard/create-team/preview?selected=${encodeSelectedIds(team.playerIds)}&teamName=${encodeURIComponent(team.teamName)}&teamId=${team.id}&readonly=1&captainId=${encodeURIComponent(team.captainId || "")}&viceCaptainId=${encodeURIComponent(team.viceCaptainId || "")}&matchId=${encodeURIComponent(team.matchId || "")}&league=${encodeURIComponent(team.league)}&date=${encodeURIComponent(team.date)}&time=${encodeURIComponent(team.time)}&team1=${encodeURIComponent(team.team1)}&team2=${encodeURIComponent(team.team2)}`}
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
