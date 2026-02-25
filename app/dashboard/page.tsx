"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarDays, Target, Trophy, Users, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [pagination, setPagination] = useState({ page: 1, size: 6, totalItems: 0, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
          fetch(`${API_BASE_URL}/api/matches?page=${currentPage}&size=${pageSize}&status=upcoming`, {
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
            isLive: false,
            createHref,
            createLabel: existingEntry ? "Edit Team" : "Create Team",
          };
        });

        if (isMounted) {
          setAvailableMatches(mapped);
          setMyEntries(entriesRows);
          
          // Set pagination from API response
          const paginationData = matchesPayload.pagination || {
            page: currentPage,
            size: pageSize,
            totalItems: rows.length,
            totalPages: 1,
          };
          setPagination(paginationData);
        }
      } catch (error) {
        if (isMounted) {
          setMatchesError(error instanceof Error ? error.message : "Failed to load dashboard data");
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
  }, [currentPage, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const { page, totalPages } = pagination;
    const pages: React.ReactNode[] = [];
    const delta = 1;

    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    // First page
    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isDark
              ? "text-slate-200 bg-slate-800 border border-slate-600 hover:bg-slate-700"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span key="start-ellipsis" className={`px-2 py-2 ${isDark ? "text-slate-500" : "text-gray-500"}`}>
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            i === page
              ? "bg-red-600 text-white border border-red-600"
              : isDark
                ? "text-slate-200 bg-slate-800 border border-slate-600 hover:bg-slate-700"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className={`px-2 py-2 ${isDark ? "text-slate-500" : "text-gray-500"}`}>
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isDark
              ? "text-slate-200 bg-slate-800 border border-slate-600 hover:bg-slate-700"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

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
    [myEntries],
  );

  return (
    <div className={`flex min-h-screen font-['Poppins'] ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50"}`}>
      <Sidebar />

      <main
        className={`flex-1 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_38%),#0f172a]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(251,113,133,0.10),transparent_36%),#f8fafc]"
        }`}
      >
        <header
          className={`sticky top-0 z-20 flex items-center justify-between border-b px-8 py-5 backdrop-blur ${
            isDark ? "border-slate-700/70 bg-slate-900/80" : "border-gray-200/80 bg-white/80"
          }`}
        >
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              Dashboard
            </h2>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Welcome back {fullName.split(" ")[0]}! Ready to build today&apos;s winning team?
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="w-full space-y-7 p-8">
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div
              className={`relative overflow-hidden rounded-3xl border p-5 lg:p-6 xl:col-span-1 ${
                isDark
                  ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800"
                  : "border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100"
              }`}
            >
              <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  Available Credit
                </p>
                <p className={`mt-2 text-3xl font-black tracking-tight md:text-4xl ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                  {balance.toFixed(1)}
                </p>
                <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  Ready to use in upcoming contests
                </p>
                <div className="mt-4">
                <Link
                  href="/dashboard/wallet"
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-semibold transition ${
                    isDark
                      ? "border-slate-600 bg-slate-900/60 text-slate-200 hover:bg-slate-900"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  Open Wallet
                </Link>
                </div>
              </div>
            </div>

            <div
              className={`rounded-3xl border p-6 lg:p-7 shadow-sm xl:col-span-2 ${
                isDark ? "border-slate-700 bg-slate-900/95" : "border-gray-200 bg-white"
              }`}
            >
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
                  <StatItem isDark={isDark} icon={<Users className="h-4 w-4 text-blue-500" />} label="My Teams" value={String(myTeams.length)} />
                  <StatItem isDark={isDark} icon={<CalendarDays className="h-4 w-4 text-orange-500" />} label="Matches" value={String(availableMatches.length)} />
                  <StatItem isDark={isDark} icon={<Target className="h-4 w-4 text-emerald-500" />} label="Avg Points" value={myTeams.length ? String(Math.round(myTeams.reduce((acc, team) => acc + team.points, 0) / myTeams.length)) : "0"} />
                  <StatItem isDark={isDark} icon={<Trophy className="h-4 w-4 text-yellow-500" />} label="Best Score" value={myTeams.length ? String(Math.max(...myTeams.map((team) => team.points))) : "0"} />
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div
              className={`inline-flex gap-2 rounded-2xl border p-2 ${
                isDark ? "border-slate-700 bg-slate-900/95" : "border-gray-200 bg-white"
              }`}
            >
              <button
                onClick={() => {
                  setActiveTab("upcoming");
                  router.replace("/dashboard?tab=upcoming");
                }}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
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
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  resolvedActiveTab === "myteams"
                    ? "bg-red-500 text-white shadow-sm"
                    : isDark
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Teams
              </button>
            </div>

            <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>
              {resolvedActiveTab === "upcoming" ? "Available Matches" : "My Teams"}
            </h3>
          </section>

          {resolvedActiveTab === "upcoming" ? (
            <>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {loading || matchesLoading ? (
                <>
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                  <MatchCardSkeleton />
                </>
              ) : matchesError ? (
                <div
                  className={`col-span-full rounded-2xl border p-8 text-center ${
                    isDark
                      ? "border-red-400/30 bg-red-500/10 text-red-200"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
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
                <div
                  className={`col-span-full rounded-2xl border p-8 text-center ${
                    isDark ? "border-slate-700 bg-slate-900 text-slate-300" : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  No upcoming matches available.
                </div>
              )}
            </section>

            {/* Pagination */}
            {pagination.totalItems > 0 && (
              <div
                className={`rounded-2xl border px-6 py-4 ${
                  isDark ? "border-slate-700 bg-slate-900/95" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                    Showing{" "}
                    <span className="font-medium">{(pagination.page - 1) * pagination.size + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.size, pagination.totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.totalItems}</span> matches
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "text-slate-200 bg-slate-800 border border-slate-600 hover:bg-slate-700 disabled:hover:bg-slate-800"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:hover:bg-white"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    {renderPaginationButtons()}

                    <button
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "text-slate-200 bg-slate-800 border border-slate-600 hover:bg-slate-700 disabled:hover:bg-slate-800"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:hover:bg-white"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
          ) : loading || matchesLoading ? (
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <TeamCardSkeleton />
              <TeamCardSkeleton />
              <TeamCardSkeleton />
            </section>
          ) : myTeams.length > 0 ? (
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
            <section
              className={`rounded-3xl border border-dashed p-12 text-center ${
                isDark ? "border-slate-600 bg-slate-900" : "border-gray-300 bg-gray-50"
              }`}
            >
              <p className={`mb-2 text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>No Teams Yet</p>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                Create a team from upcoming matches to start competing.
              </p>
              <Link
                href="/dashboard?tab=upcoming"
                className="mt-5 inline-flex rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
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
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
        isDark ? "border-slate-700 bg-slate-800/70" : "border-gray-200 bg-gray-50"
      }`}
    >
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
    <div
      className={`h-14 animate-pulse rounded-xl border ${
        isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"
      }`}
    />
  );
}

function MatchCardSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <div
      className={`h-[320px] animate-pulse rounded-2xl border ${
        isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"
      }`}
    />
  );
}

function TeamCardSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <div
      className={`h-[360px] animate-pulse rounded-2xl border ${
        isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"
      }`}
    />
  );
}
