"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarDays, Plus, Target, Trophy, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./_components/Sidebar";
import ThemeToggle from "./_components/ThemeToggle";
import { useThemeMode } from "./_components/useThemeMode";
import MatchCard from "./_components/MatchCard";
import TeamCard from "./_components/TeamCard";
import { encodeSelectedIds } from "./create-team/teamBuilder";
import { getMyContestEntriesAction } from "@/app/lib/action/leaderboard_action";

interface ApiMatch {
  _id: string;
  league?: string;
  startTime: string;
  status?: string;
  teamA?: { shortName?: string };
  teamB?: { shortName?: string };
}

interface EntryMatch {
  id: string;
  league?: string;
  startTime?: string;
  status?: string;
  teamA?: { shortName?: string };
  teamB?: { shortName?: string };
}

interface ContestEntry {
  matchId: string;
  entryId: string;
  teamId: string;
  teamName: string;
  captainId: string;
  viceCaptainId: string;
  playerIds: string[];
  points: number;
  match: EntryMatch | null;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { isDark } = useThemeMode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upcoming" | "myteams">("upcoming");
  const [availableMatches, setAvailableMatches] = useState<
    Array<{
      id: string;
      league: string;
      date: string;
      time: string;
      team1: string;
      team2: string;
      isLive: boolean;
      createHref: string;
      createLabel: string;
    }>
  >([]);
  const [myEntries, setMyEntries] = useState<ContestEntry[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  const fullName = user?.fullName || "User";
  const balance = user?.balance ?? 0;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setMatchesLoading(true);
      setMatchesError(null);

      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:3001";

        const [matchesResponse, entriesResult] = await Promise.all([
          fetch(`${API_BASE_URL}/api/matches?page=1&size=12&status=upcoming,live`, {
            cache: "no-store",
          }),
          getMyContestEntriesAction(),
        ]);

        const matchesPayload = await matchesResponse.json().catch(() => ({}));
        if (!matchesResponse.ok || !matchesPayload?.success) {
          throw new Error(matchesPayload?.message || "Failed to load matches");
        }

        if (!entriesResult.success) {
          throw new Error(entriesResult.message || "Failed to load entries");
        }

        const entriesRows = (entriesResult.data || []) as ContestEntry[];
        const entryByMatch = new Map(entriesRows.map((entry) => [entry.matchId, entry]));

        const rows: ApiMatch[] = Array.isArray(matchesPayload?.data) ? matchesPayload.data : [];
        const mapped = rows.map((match) => {
          const matchId = String(match._id);
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
          const existingEntry = entryByMatch.get(matchId);

          const createHref = existingEntry
            ? `/dashboard/create-team?selected=${encodeSelectedIds(existingEntry.playerIds || [])}&teamName=${encodeURIComponent(existingEntry.teamName || "My Team")}&teamId=${encodeURIComponent(existingEntry.teamId || "")}&captainId=${encodeURIComponent(existingEntry.captainId || "")}&viceCaptainId=${encodeURIComponent(existingEntry.viceCaptainId || "")}&matchId=${encodeURIComponent(matchId)}&league=${encodeURIComponent(league)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`
            : `/dashboard/create-team?matchId=${encodeURIComponent(matchId)}&league=${encodeURIComponent(league)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`;

          return {
            id: matchId,
            league,
            date,
            time,
            team1,
            team2,
            isLive: match.status === "live",
            createHref,
            createLabel: existingEntry ? "Edit Team" : "Create Team",
          };
        });

        if (isMounted) {
          setAvailableMatches(mapped);
          setMyEntries(entriesRows);
        }
      } catch (error) {
        if (isMounted) {
          setMatchesError(
            error instanceof Error ? error.message : "Failed to load dashboard data"
          );
        }
      } finally {
        if (isMounted) {
          setMatchesLoading(false);
        }
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const tabFromQuery = searchParams.get("tab");
  const resolvedActiveTab =
    tabFromQuery === "myteams" || tabFromQuery === "upcoming" ? tabFromQuery : activeTab;

  const myTeams = useMemo(
    () =>
      myEntries
        .filter((entry) => entry.match)
        .map((entry) => {
          const match = entry.match as EntryMatch;
          const startTime = new Date(String(match.startTime || new Date().toISOString()));
          const date = startTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          });
          const time = startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });
          return {
            id: entry.teamId,
            matchId: entry.matchId,
            league: String(match.league || "League"),
            date,
            time,
            team1: String(match.teamA?.shortName || "T1"),
            team2: String(match.teamB?.shortName || "T2"),
            teamName: entry.teamName,
            points: Number(entry.points || 0),
            playerIds: entry.playerIds || [],
            captainId: entry.captainId || "",
            viceCaptainId: entry.viceCaptainId || "",
          };
        }),
    [myEntries]
  );

  return (
    <div className={`min-h-screen flex font-['Poppins'] ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50"}`}>
      <Sidebar />

      <main className={`flex-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <header className={`px-8 py-6 flex items-center justify-between ${isDark ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
          <div>
            <h2 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Dashboard</h2>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>Welcome back {fullName.split(" ")[0]}! Ready to build today&apos;s winning team?</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="p-8 max-w-7xl space-y-7">
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className={`xl:col-span-2 rounded-3xl border p-8 ${isDark ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" : "border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100"}`}>
              <p className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>Available Credit</p>
              <p className={`text-6xl font-bold mt-2 ${isDark ? "text-slate-100" : "text-gray-900"}`}>{balance.toFixed(1)}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className={`px-6 py-3 rounded-xl font-semibold transition shadow-sm inline-flex items-center gap-2 ${isDark ? "bg-slate-900 text-red-300 hover:bg-slate-800 border border-slate-600" : "bg-white text-red-500 hover:bg-gray-50"}`}>
                  <Plus className="w-4 h-4" />
                  Add Credit
                </button>
                <Link
                  href="/dashboard/wallet"
                  className={`px-6 py-3 rounded-xl border font-medium transition ${isDark ? "border-slate-600 bg-slate-900/60 text-slate-200 hover:bg-slate-900" : "border-orange-200 bg-white/70 text-gray-700 hover:bg-white"}`}
                >
                  Open Wallet
                </Link>
              </div>
            </div>

            <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
              <h3 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Quick Snapshot</h3>
              {loading || matchesLoading ? (
                <div className="mt-4 space-y-3">
                  <StatItemSkeleton isDark={isDark} />
                  <StatItemSkeleton isDark={isDark} />
                  <StatItemSkeleton isDark={isDark} />
                  <StatItemSkeleton isDark={isDark} />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <StatItem isDark={isDark} icon={<Users className="w-4 h-4 text-blue-500" />} label="My Teams" value={String(myTeams.length)} />
                  <StatItem isDark={isDark} icon={<CalendarDays className="w-4 h-4 text-orange-500" />} label="Matches" value={String(availableMatches.length)} />
                  <StatItem isDark={isDark} icon={<Target className="w-4 h-4 text-green-500" />} label="Avg Points" value={myTeams.length ? String(Math.round(myTeams.reduce((acc, team) => acc + team.points, 0) / myTeams.length)) : "0"} />
                  <StatItem isDark={isDark} icon={<Trophy className="w-4 h-4 text-yellow-600" />} label="Best Score" value={myTeams.length ? String(Math.max(...myTeams.map((team) => team.points))) : "0"} />
                </div>
              )}
            </div>
          </section>

          <section className={`rounded-2xl border p-2 inline-flex gap-2 ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
            <button
              onClick={() => {
                setActiveTab("upcoming");
                router.replace("/dashboard?tab=upcoming");
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                resolvedActiveTab === "upcoming"
                  ? "bg-red-500 text-white shadow-sm"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-800"
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
                  : isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Teams
            </button>
          </section>

          {resolvedActiveTab === "upcoming" ? (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading || matchesLoading ? (
                <>
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                </>
              ) : matchesError ? (
                <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                  {matchesError}
                </div>
              ) : availableMatches.length > 0 ? (
                availableMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    league={match.league}
                    date={match.date}
                    time={match.time}
                    team1={match.team1}
                    team2={match.team2}
                    isLive={match.isLive}
                    createHref={match.createHref}
                    createLabel={match.createLabel}
                  />
                ))
              ) : (
                <div className={`col-span-full rounded-2xl border p-8 text-center ${isDark ? "border-slate-700 bg-slate-900 text-slate-300" : "border-gray-200 bg-white text-gray-600"}`}>
                  No upcoming/live matches available.
                </div>
              )}
            </section>
          ) : loading || matchesLoading ? (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <TeamCardSkeleton />
              <TeamCardSkeleton />
              <TeamCardSkeleton />
            </section>
          ) : myTeams.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  league={team.league}
                  date={team.date}
                  time={team.time}
                  team1={team.team1}
                  team2={team.team2}
                  teamName={team.teamName}
                  points={team.points}
                  viewHref={`/dashboard/create-team/preview?selected=${encodeSelectedIds(team.playerIds)}&teamName=${encodeURIComponent(team.teamName)}&teamId=${encodeURIComponent(team.id)}&readonly=1&captainId=${encodeURIComponent(team.captainId || "")}&viceCaptainId=${encodeURIComponent(team.viceCaptainId || "")}&matchId=${encodeURIComponent(team.matchId || "")}&league=${encodeURIComponent(team.league)}&date=${encodeURIComponent(team.date)}&time=${encodeURIComponent(team.time)}&team1=${encodeURIComponent(team.team1)}&team2=${encodeURIComponent(team.team2)}`}
                />
              ))}
            </section>
          ) : (
            <section className={`rounded-3xl border border-dashed p-12 text-center ${isDark ? "border-slate-600 bg-slate-900" : "border-gray-300 bg-gray-50"}`}>
              <p className={`text-xl font-bold mb-2 ${isDark ? "text-slate-100" : "text-gray-900"}`}>No Teams Yet</p>
              <p className={`${isDark ? "text-slate-300" : "text-gray-600"} text-sm`}>Create a team from upcoming matches to start competing.</p>
              <Link
                href="/dashboard?tab=upcoming"
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

function StatItem({ icon, label, value, isDark }: { icon: ReactNode; label: string; value: string; isDark: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${isDark ? "border-slate-700 bg-slate-800/80" : "border-gray-100 bg-gray-50"}`}>
      <div className={`flex items-center gap-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function StatItemSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className={`h-14 rounded-xl border animate-pulse ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-gray-100"}`} />
  );
}

function MatchCardSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <div className={`h-[320px] rounded-2xl border animate-pulse ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"}`} />
  );
}

function TeamCardSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <div className={`h-[360px] rounded-2xl border animate-pulse ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"}`} />
  );
}
