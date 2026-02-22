"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/Sidebar";
import ThemeToggle from "../_components/ThemeToggle";
import { useThemeMode } from "../_components/useThemeMode";
import { API } from "@/app/lib/api/endpoints";
import {
  getLeaderboardContestsAction,
  getMatchLeaderboardAction,
} from "@/app/lib/action/leaderboard_action";

interface ContestItem {
  id: string;
  matchLabel: string;
  startsAt: string;
  status: "upcoming" | "live" | "completed";
  entryFee: number;
  participantsCount: number;
  prizePool: number;
}

interface LeaderItem {
  userId: string;
  rank: number;
  name: string;
  teams: number;
  pts: number;
  winRate: number;
  prize: number;
}

interface MatchLeaderboardPayload {
  match: {
    id: string;
    matchLabel: string;
    startsAt: string;
    status: "upcoming" | "live" | "completed";
  };
  leaders: LeaderItem[];
  myEntry: LeaderItem | null;
}

const formatCredits = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);

export default function LeaderboardPage() {
  const { loading, user } = useAuth();
  const { isDark } = useThemeMode();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:3001";
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [contestStatus, setContestStatus] = useState<"live" | "completed">("live");
  const [contests, setContests] = useState<ContestItem[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<MatchLeaderboardPayload | null>(null);
  const [screenLoading, setScreenLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadContests = async () => {
      setScreenLoading(true);
      setError(null);

      const result = await getLeaderboardContestsAction(contestStatus);
      if (!mounted) {
        return;
      }

      if (!result.success) {
        setError(result.message || "Failed to load contests");
        setContests([]);
        setLeaderboardData(null);
        setScreenLoading(false);
        return;
      }

      const rows = (result.data || []) as ContestItem[];
      setContests(rows);

      const nextSelectedId = rows[0]?.id || "";
      setSelectedMatchId(nextSelectedId);
      setScreenLoading(false);
    };

    void loadContests();

    return () => {
      mounted = false;
    };
  }, [contestStatus]);

  useEffect(() => {
    if (!selectedMatchId) {
      return;
    }

    const streamUrl = `${API_BASE_URL}${API.LEADERBOARD.LIVE_BY_MATCH(selectedMatchId)}`;
    const eventSource = new EventSource(streamUrl);
    let closed = false;

    eventSource.addEventListener("connected", () => {
      if (!closed) {
        setLiveConnected(true);
      }
    });

    eventSource.addEventListener("leaderboard_update", (event) => {
      if (closed || !(event instanceof MessageEvent)) {
        return;
      }

      try {
        const payload = JSON.parse(event.data) as MatchLeaderboardPayload;
        const userId = String(user?._id || user?.id || "");
        if (!payload.myEntry && userId) {
          payload.myEntry =
            payload.leaders.find((leader) => String(leader.userId) === userId) || null;
        }
        setLeaderboardData(payload);
      } catch {
        // Ignore malformed stream messages.
      }
    });

    eventSource.onerror = () => {
      if (!closed) {
        setLiveConnected(false);
      }
    };

    return () => {
      closed = true;
      setLiveConnected(false);
      eventSource.close();
    };
  }, [API_BASE_URL, selectedMatchId, user?._id, user?.id]);

  useEffect(() => {
    let mounted = true;

    const loadLeaderboard = async () => {
      if (!selectedMatchId) {
        setLeaderboardData(null);
        return;
      }

      setScreenLoading(true);
      setError(null);

      const result = await getMatchLeaderboardAction(selectedMatchId);
      if (!mounted) {
        return;
      }

      if (!result.success) {
        setError(result.message || "Failed to load leaderboard");
        setLeaderboardData(null);
        setScreenLoading(false);
        return;
      }

      setLeaderboardData((result.data || null) as MatchLeaderboardPayload | null);
      setScreenLoading(false);
    };

    void loadLeaderboard();

    return () => {
      mounted = false;
    };
  }, [selectedMatchId]);

  const selectedContest = useMemo(
    () => contests.find((item) => item.id === selectedMatchId) || contests[0] || null,
    [contests, selectedMatchId]
  );

  const leaders = leaderboardData?.leaders || [];
  const myEntry = leaderboardData?.myEntry || null;

  return (
    <div className={`min-h-screen flex font-['Poppins'] ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50"}`}>
      <Sidebar />

      <main className={`flex-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <header className={`px-8 py-6 flex items-center justify-between ${isDark ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
          <div>
            <h2 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Leaderboard</h2>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>Match contest rankings with upcoming/completed states.</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="p-8 max-w-7xl">
          {error ? (
            <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${isDark ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"}`}>
              {error}
            </div>
          ) : null}

          <section className={`mb-6 rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="inline-flex items-center gap-3">
                <select
                  value={contestStatus}
                  onChange={(event) => setContestStatus(event.target.value as "live" | "completed")}
                  className={`rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 ${isDark ? "border-slate-600 bg-slate-800 text-slate-200" : "border-gray-300 bg-white text-gray-700"}`}
                >
                  <option value="live">Live Contests</option>
                  <option value="completed">Completed Contests</option>
                </select>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    liveConnected
                      ? "bg-emerald-100 text-emerald-700"
                      : isDark
                        ? "bg-slate-800 text-slate-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {liveConnected ? "Live Stream On" : "Live Stream Off"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>Match Contest</p>
                <select
                  value={selectedMatchId}
                  onChange={(event) => setSelectedMatchId(event.target.value)}
                  disabled={loading || screenLoading || contests.length === 0}
                  className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 ${isDark ? "border-slate-600 text-slate-200 bg-slate-800" : "border-gray-300 text-gray-700 bg-white"}`}
                >
                  {contests.map((contest) => (
                    <option key={contest.id} value={contest.id}>
                      {contest.matchLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {selectedContest ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <section className={`xl:col-span-2 rounded-3xl border p-8 ${isDark ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" : "border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100"}`}>
                <div className={`flex items-center gap-2 mb-2 ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                  <Trophy className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-bold">{selectedContest.matchLabel}</h3>
                </div>
                <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>{new Date(selectedContest.startsAt).toLocaleString("en-US")}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <StatCard label="Status" value={selectedContest.status.toUpperCase()} />
                  <StatCard label="Entry Fee" value={formatCredits(selectedContest.entryFee)} />
                  <StatCard label="Participants" value={String(selectedContest.participantsCount)} />
                  <StatCard label="Prize Pool" value={formatCredits(selectedContest.prizePool)} />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {screenLoading || loading ? (
                    <>
                      <PodiumSkeleton />
                      <PodiumSkeleton />
                      <PodiumSkeleton />
                    </>
                  ) : (
                    leaders.slice(0, 3).map((leader) => (
                      <PodiumCard key={leader.userId} leader={leader} />
                    ))
                  )}
                </div>
              </section>

              <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
                <h3 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Your Standing</h3>
                <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>For {selectedContest.matchLabel}</p>

                {screenLoading || loading ? (
                  <div className={`mt-5 h-36 rounded-2xl border animate-pulse ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"}`} />
                ) : myEntry ? (
                  <div className={`mt-5 rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200"}`}>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Current Rank</p>
                    <p className={`text-4xl font-bold mt-1 ${isDark ? "text-slate-100" : "text-gray-900"}`}>#{myEntry.rank}</p>
                    <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-gray-600"}`}>{myEntry.pts} pts · {myEntry.winRate}% win rate</p>
                    <p className="text-sm font-semibold text-green-600 mt-2">
                      Prize: {formatCredits(myEntry.prize)} credits
                    </p>
                  </div>
                ) : (
                  <div className={`mt-5 rounded-2xl border p-4 text-sm ${isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-600"}`}>
                    You do not have a standing yet for this contest.
                  </div>
                )}
              </section>

              <section className={`xl:col-span-3 rounded-3xl border shadow-sm overflow-hidden ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
                <div className={`px-6 py-5 flex items-center justify-between ${isDark ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
                  <h3 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Contest Rankings</h3>
                  <span className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Top 20 participants</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className={isDark ? "bg-slate-800" : "bg-gray-50"}>
                      <tr>
                        <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-300" : "text-gray-600"}`}>Rank</th>
                        <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-300" : "text-gray-600"}`}>Player</th>
                        <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-300" : "text-gray-600"}`}>Teams</th>
                        <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-300" : "text-gray-600"}`}>Points</th>
                        <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-300" : "text-gray-600"}`}>Win Rate</th>
                        <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? "text-slate-300" : "text-gray-600"}`}>Prize</th>
                      </tr>
                    </thead>
                    <tbody>
                      {screenLoading || loading ? (
                        <>
                          <LeaderboardRowSkeleton />
                          <LeaderboardRowSkeleton />
                          <LeaderboardRowSkeleton />
                          <LeaderboardRowSkeleton />
                          <LeaderboardRowSkeleton />
                        </>
                      ) : (
                        leaders.map((leader) => (
                          <tr key={leader.userId} className={`border-t transition ${isDark ? "border-slate-800 hover:bg-slate-800/70" : "border-gray-100 hover:bg-gray-50"}`}>
                            <td className="px-6 py-4">{rankBadge(leader.rank)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full font-semibold flex items-center justify-center ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-100 text-gray-700"}`}>
                                  {leader.name.charAt(0)}
                                </div>
                                <span className={`font-medium ${isDark ? "text-slate-100" : "text-gray-900"}`}>{leader.name}</span>
                              </div>
                            </td>
                            <td className={`px-6 py-4 ${isDark ? "text-slate-300" : "text-gray-700"}`}>{leader.teams}</td>
                            <td className={`px-6 py-4 font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{leader.pts}</td>
                            <td className="px-6 py-4 text-red-500 font-semibold">{leader.winRate}%</td>
                            <td className="px-6 py-4 text-green-600 font-semibold">{formatCredits(leader.prize)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <div className={`rounded-2xl border p-8 text-center ${isDark ? "border-slate-700 bg-slate-900 text-slate-300" : "border-gray-200 bg-white text-gray-600"}`}>
              No completed contests available.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  const { isDark } = useThemeMode();
  return (
    <div className={`rounded-2xl border p-4 ${isDark ? "bg-slate-900 border-slate-600" : "bg-white/80 border-white"}`}>
      <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}>{label}</p>
      <p className={`text-xl font-bold mt-1 ${isDark ? "text-slate-100" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function rankBadge(rank: number) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
        <Crown className="w-3.5 h-3.5" />
        #1
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
        <Medal className="w-3.5 h-3.5" />
        #2
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
        <Medal className="w-3.5 h-3.5" />
        #3
      </span>
    );
  }

  return <span className="text-gray-700 font-medium">#{rank}</span>;
}

function PodiumCard({ leader }: { leader: LeaderItem }) {
  const { isDark } = useThemeMode();
  const tone =
    leader.rank === 1
      ? isDark
        ? "bg-yellow-500/10 border-yellow-400/35"
        : "bg-yellow-50 border-yellow-200"
      : leader.rank === 2
        ? isDark
          ? "bg-slate-800 border-slate-600"
          : "bg-gray-50 border-gray-200"
        : isDark
          ? "bg-orange-500/10 border-orange-400/35"
          : "bg-orange-50 border-orange-200";

  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Rank #{leader.rank}</p>
      <p className={`text-lg font-bold mt-1 ${isDark ? "text-slate-100" : "text-gray-900"}`}>{leader.name}</p>
      <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>{leader.pts} points</p>
      <p className={`text-sm font-semibold mt-1 ${isDark ? "text-emerald-300" : "text-green-600"}`}>Prize: {formatCredits(leader.prize)}</p>
    </div>
  );
}

function PodiumSkeleton() {
  const { isDark } = useThemeMode();
  return <div className={`h-28 rounded-2xl border animate-pulse ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white/70"}`} />;
}

function LeaderboardRowSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <tr className={`border-t ${isDark ? "border-slate-800" : "border-gray-100"}`}>
      <td className="px-6 py-4">
        <div className={`h-5 w-10 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </td>
      <td className="px-6 py-4">
        <div className={`h-6 w-40 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </td>
      <td className="px-6 py-4">
        <div className={`h-5 w-8 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </td>
      <td className="px-6 py-4">
        <div className={`h-5 w-14 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </td>
      <td className="px-6 py-4">
        <div className={`h-5 w-12 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </td>
      <td className="px-6 py-4">
        <div className={`h-5 w-16 rounded animate-pulse ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </td>
    </tr>
  );
}
