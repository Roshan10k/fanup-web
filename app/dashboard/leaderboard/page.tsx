"use client";

import { useMemo, useState } from "react";
import { Bell, Crown, Medal, Trophy, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/Sidebar";

interface LeaderItem {
  rank: number;
  name: string;
  teams: number;
  pts: number;
  winRate: number;
}

interface MatchLeaderboard {
  id: string;
  matchLabel: string;
  startsAt: string;
  leaders: LeaderItem[];
}

const matchLeaderboards: MatchLeaderboard[] = [
  {
    id: "ind-aus-1",
    matchLabel: "IND vs AUS",
    startsAt: "Nov 4, 3:15 PM",
    leaders: [
      { rank: 1, name: "Roshan K.", teams: 3, pts: 300, winRate: 71 },
      { rank: 2, name: "Nishad M.", teams: 2, pts: 200, winRate: 64 },
      { rank: 3, name: "Sworup P.", teams: 2, pts: 199, winRate: 61 },
      { rank: 4, name: "Aaryan D.", teams: 2, pts: 176, winRate: 58 },
      { rank: 5, name: "Nikita T.", teams: 1, pts: 168, winRate: 56 },
      { rank: 6, name: "Prasun R.", teams: 1, pts: 161, winRate: 54 },
    ],
  },
  {
    id: "pak-sa-1",
    matchLabel: "PAK vs SA",
    startsAt: "Nov 6, 6:30 PM",
    leaders: [
      { rank: 1, name: "Nikita T.", teams: 2, pts: 282, winRate: 68 },
      { rank: 2, name: "Roshan K.", teams: 3, pts: 270, winRate: 66 },
      { rank: 3, name: "Bibek S.", teams: 2, pts: 254, winRate: 60 },
      { rank: 4, name: "Nishad M.", teams: 2, pts: 231, winRate: 57 },
      { rank: 5, name: "Prasun R.", teams: 1, pts: 219, winRate: 53 },
      { rank: 6, name: "Rina P.", teams: 1, pts: 205, winRate: 51 },
    ],
  },
  {
    id: "eng-nz-1",
    matchLabel: "ENG vs NZ",
    startsAt: "Nov 8, 1:00 PM",
    leaders: [
      { rank: 1, name: "Sworup P.", teams: 2, pts: 295, winRate: 70 },
      { rank: 2, name: "Aaryan D.", teams: 2, pts: 274, winRate: 67 },
      { rank: 3, name: "Roshan K.", teams: 3, pts: 258, winRate: 63 },
      { rank: 4, name: "Nikita T.", teams: 2, pts: 240, winRate: 59 },
      { rank: 5, name: "Bibek S.", teams: 1, pts: 211, winRate: 54 },
      { rank: 6, name: "Rina P.", teams: 1, pts: 198, winRate: 50 },
    ],
  },
];

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState(matchLeaderboards[0]?.id ?? "");
  const fullName = user?.fullName || "User";

  const selectedMatch = useMemo(
    () => matchLeaderboards.find((item) => item.id === selectedMatchId) ?? matchLeaderboards[0],
    [selectedMatchId],
  );
  const leaders = useMemo(() => selectedMatch?.leaders ?? [], [selectedMatch]);
  const currentUser = useMemo(
    () => leaders.find((item) => item.name.startsWith(fullName.split(" ")[0])) || leaders[4] || leaders[0],
    [leaders, fullName],
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex font-['Poppins'] bg-gray-50">
      <Sidebar />

      <main className="flex-1 bg-white">
        <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Leaderboard</h2>
            <p className="text-sm text-gray-700 mt-2">Match-wise rankings update after every match.</p>
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-full" aria-label="Notifications">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="p-8 max-w-7xl">
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Selected Match</p>
                <p className="text-lg font-bold text-gray-900">{selectedMatch.matchLabel}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <p className="text-sm text-gray-600">{selectedMatch.startsAt}</p>
                <select
                  value={selectedMatchId}
                  onChange={(event) => setSelectedMatchId(event.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  {matchLeaderboards.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.matchLabel} - {match.startsAt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 rounded-3xl border border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-8">
              <div className="flex items-center gap-2 text-gray-900 mb-6">
                <Trophy className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold">Top 3 For {selectedMatch.matchLabel}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leaders.slice(0, 3).map((leader) => (
                  <PodiumCard key={leader.rank} leader={leader} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Your Standing</h3>
              <p className="text-sm text-gray-600 mt-1">Your rank for {selectedMatch.matchLabel}</p>

              <div className="mt-5 rounded-2xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Current Rank</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">#{currentUser.rank}</p>
                <p className="text-sm text-gray-600 mt-2">{currentUser.pts} pts · {currentUser.winRate}% win rate</p>
              </div>

              <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-green-700">You moved up 2 positions after the latest match update.</p>
              </div>
            </section>

            <section className="xl:col-span-3 rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Match Rankings</h3>
                <span className="text-sm text-gray-500">Updated after result processing</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Rank</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Player</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Teams</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Points</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((leader) => (
                      <tr key={leader.rank} className="border-t border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">{rankBadge(leader.rank)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-semibold flex items-center justify-center">
                              {leader.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{leader.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{leader.teams}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{leader.pts}</td>
                        <td className="px-6 py-4 text-red-500 font-semibold">{leader.winRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
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
  const tone =
    leader.rank === 1
      ? "bg-yellow-50 border-yellow-200"
      : leader.rank === 2
        ? "bg-gray-50 border-gray-200"
        : "bg-orange-50 border-orange-200";

  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="text-xs text-gray-500">Rank #{leader.rank}</p>
      <p className="text-lg font-bold text-gray-900 mt-1">{leader.name}</p>
      <p className="text-sm text-gray-700 mt-2">{leader.pts} points</p>
      <p className="text-sm text-red-500 font-semibold mt-1">{leader.winRate}% win rate</p>
    </div>
  );
}
