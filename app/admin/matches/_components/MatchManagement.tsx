"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminMatchesAction,
  getAdminMatchLeaderboardAction,
  lockMatchAction,
  completeAndSettleMatchAction,
} from "@/app/lib/action/admin/match_action";
import { Loader2, Lock, CheckCircle, Trophy } from "lucide-react";

type Match = {
  id: string;
  label: string;
  league: string;
  teamA: string;
  teamB: string;
  startTime: string;
  status: string;
  isEditable: boolean;
};

type LeaderboardEntry = {
  userId: string;
  rank: number;
  name: string;
  teams: number;
  pts: number;
  winRate: number;
  prize: number;
};

type LeaderboardData = {
  match: {
    id: string;
    matchLabel: string;
    startsAt: string;
    status: string;
  };
  leaders: LeaderboardEntry[];
  myEntry: LeaderboardEntry | null;
};

export default function MatchManagement() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const result = await getAdminMatchesAction("upcoming,locked,completed");
      if (result.success && Array.isArray(result.data)) {
        setMatches(result.data as Match[]);
      } else {
        toast.error(result.message || "Failed to load matches");
      }
    } catch (error) {
      toast.error("Error loading matches");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (matchId: string) => {
    if (!matchId) return;

    setLoading(true);
    try {
      const result = await getAdminMatchLeaderboardAction(matchId);
      if (result.success && result.data) {
        setLeaderboard(result.data as LeaderboardData);
      } else {
        toast.error(result.message || "Failed to load leaderboard");
        setLeaderboard(null);
      }
    } catch (error) {
      toast.error("Error loading leaderboard");
      console.error(error);
      setLeaderboard(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSelect = (matchId: string) => {
    setSelectedMatchId(matchId);
    if (matchId) {
      loadLeaderboard(matchId);
    } else {
      setLeaderboard(null);
    }
  };

  const handleLockMatch = async () => {
    if (!selectedMatchId) return;

    setActionLoading(true);
    try {
      const result = await lockMatchAction(selectedMatchId);
      if (result.success) {
        toast.success(result.message || "Match locked successfully");
        await loadMatches();
        await loadLeaderboard(selectedMatchId);
      } else {
        toast.error(result.message || "Failed to lock match");
      }
    } catch (error) {
      toast.error("Error locking match");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteAndSettle = async () => {
    if (!selectedMatchId) return;

    if (!confirm("Are you sure you want to complete and settle this match? This will distribute prizes and cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await completeAndSettleMatchAction(selectedMatchId);
      if (result.success) {
        toast.success(result.message || "Match completed and settled successfully");
        await loadMatches();
        setSelectedMatchId("");
        setLeaderboard(null);
      } else {
        toast.error(result.message || "Failed to complete and settle match");
      }
    } catch (error) {
      toast.error("Error completing match");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  return (
    <div className="space-y-6">
      {/* Match Selection */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Match</h2>
        
        {loading && !matches.length ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedMatchId}
              onChange={(e) => handleMatchSelect(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Select a match...</option>
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.label} - {match.status.toUpperCase()} - {new Date(match.startTime).toLocaleDateString()}
                </option>
              ))}
            </select>

            {selectedMatch && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedMatch.status === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : selectedMatch.status === "locked"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedMatch.status.toUpperCase()}
                </span>
                <span className="ml-auto">
                  <span className="font-medium">Editable:</span>{" "}
                  {selectedMatch.isEditable ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedMatch && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            {selectedMatch.status === "upcoming" && selectedMatch.isEditable && (
              <button
                onClick={handleLockMatch}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Lock Match (Prevent Edits)
              </button>
            )}

            {(selectedMatch.status === "upcoming" || selectedMatch.status === "locked") && (
              <button
                onClick={handleCompleteAndSettle}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Complete & Settle
              </button>
            )}

            {selectedMatch.status === "completed" && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                This match has been completed and settled.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {selectedMatchId && (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
            </div>
            {leaderboard && (
              <p className="text-sm text-gray-600 mt-1">
                {leaderboard.match.matchLabel} - {leaderboard.leaders.length} participants
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : leaderboard && leaderboard.leaders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Player
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Win Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Prize
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.leaders.map((entry) => (
                    <tr key={entry.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : entry.rank === 2
                              ? "bg-gray-100 text-gray-700"
                              : entry.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {entry.name}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {entry.pts}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {entry.winRate}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            entry.prize > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          ₹{entry.prize}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-sm text-gray-500 text-center">
              No entries found for this match.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
