"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../_components/Sidebar";
import {
  decodeSelectedIds,
  encodeSelectedIds,
  getRoleCounts,
  isValidTeamComposition,
  matchInfo,
  mapBackendRoleToUiRole,
  players,
  roleRules,
  type Player,
  type Role,
} from "./teamBuilder";

interface ApiPlayer {
  _id: string;
  fullName?: string;
  teamShortName?: string;
  role?: string;
  credit?: number;
}

export default function CreateTeamPage() {
  const isDev = process.env.NODE_ENV !== "production";
  const searchParams = useSearchParams();
  const router = useRouter();
  const teamIdParam = searchParams.get("teamId");
  const teamId = teamIdParam ? Number(teamIdParam) : null;
  const captainId = searchParams.get("captainId") || "";
  const viceCaptainId = searchParams.get("viceCaptainId") || "";

  const [activeRole, setActiveRole] = useState<"ALL" | Role>("ALL");
  const [teamName, setTeamName] = useState(() => searchParams.get("teamName")?.trim() || "");
  const [selected, setSelected] = useState<string[]>(() => decodeSelectedIds(searchParams.get("selected")));
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(isDev ? players : []);
  const [playersError, setPlayersError] = useState<string | null>(null);
  const matchMeta = useMemo(
    () => ({
      matchId: searchParams.get("matchId") || "",
      league: searchParams.get("league") || (isDev ? matchInfo.league : ""),
      date: searchParams.get("date") || (isDev ? matchInfo.date : ""),
      time: searchParams.get("time") || (isDev ? matchInfo.time : ""),
      team1: searchParams.get("team1") || (isDev ? matchInfo.team1 : ""),
      team2: searchParams.get("team2") || (isDev ? matchInfo.team2 : ""),
    }),
    [isDev, searchParams]
  );
  const hasRequiredMatchMeta = Boolean(matchMeta.matchId && matchMeta.team1 && matchMeta.team2);

  useEffect(() => {
    let isMounted = true;

    const loadPlayers = async () => {
      if (!hasRequiredMatchMeta) {
        if (!isDev && isMounted) {
          setPlayersError("Missing match information. Please open Create Team from a match card.");
          setAvailablePlayers([]);
        }
        return;
      }

      if (isMounted) {
        setPlayersError(null);
      }

      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://localhost:3001";
        const response = await fetch(
          `${API_BASE_URL}/api/players?teamShortNames=${encodeURIComponent(
            `${matchMeta.team1},${matchMeta.team2}`
          )}`,
          { cache: "no-store" }
        );
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
          if (!isDev && isMounted) {
            setAvailablePlayers([]);
            setPlayersError(payload?.message || "Failed to load players for this match.");
          }
          return;
        }

        const mapped: Player[] = (payload.data as ApiPlayer[]).map((item) => ({
          id: String(item._id),
          name: String(item.fullName || "Player"),
          team: String(item.teamShortName || ""),
          role: mapBackendRoleToUiRole(String(item.role || "")),
          credit: Number(item.credit || 0),
        }));

        if (isMounted) {
          if (mapped.length > 0) {
            setAvailablePlayers(mapped);
            return;
          }
          if (!isDev) {
            setAvailablePlayers([]);
            setPlayersError("No players available for this match.");
          }
        }
      } catch {
        if (!isDev && isMounted) {
          setAvailablePlayers([]);
          setPlayersError("Failed to load players. Please try again.");
        }
      }
    };

    void loadPlayers();
    return () => {
      isMounted = false;
    };
  }, [hasRequiredMatchMeta, isDev, matchMeta.team1, matchMeta.team2]);

  const selectedPlayers = useMemo(
    () => availablePlayers.filter((player) => selected.includes(player.id)),
    [availablePlayers, selected]
  );
  const roleCounts = getRoleCounts(selected, availablePlayers);

  const usedCredit = selectedPlayers.reduce((sum, player) => sum + player.credit, 0);
  const creditLeft = Math.max(0, 100 - usedCredit);

  const visiblePlayers = availablePlayers.filter(
    (player) => activeRole === "ALL" || player.role === activeRole
  );

  const togglePlayer = (player: Player) => {
    setSelected((prev) => {
      const exists = prev.includes(player.id);

      if (exists) {
        return prev.filter((id) => id !== player.id);
      }

      if (prev.length >= 11) {
        return prev;
      }

      const roleCount = prev
        .map((id) => availablePlayers.find((item) => item.id === id))
        .filter((item): item is Player => item !== undefined && item.role === player.role).length;

      if (roleCount >= roleRules[player.role].max) {
        return prev;
      }

      return [...prev, player.id];
    });
  };

  const hasTeamName = teamName.trim().length > 0;
  const isReadyForPreview =
    hasTeamName &&
    !playersError &&
    availablePlayers.length > 0 &&
    hasRequiredMatchMeta &&
    isValidTeamComposition(selected, availablePlayers);

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] flex">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto pb-24">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-400 font-semibold mb-2">Team Builder</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Create Team</h1>
            <p className="text-gray-500 mt-1">
              {matchMeta.team1} vs {matchMeta.team2}, {matchMeta.date}
            </p>
          </div>

          {playersError ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {playersError}
            </div>
          ) : null}

          <section className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 xl:p-7 shadow-sm">
            <div className="mb-5">
              <label htmlFor="team-name" className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name
              </label>
              <input
                id="team-name"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                placeholder="Enter your team name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div className="sticky top-0 z-10 rounded-2xl bg-gray-100 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 border border-gray-200">
              <div>
                <p className="text-gray-500 text-sm font-medium">Players Selected</p>
                <p className="text-3xl font-bold text-gray-900">{selected.length}/11</p>
              </div>

              <div className="hidden sm:block h-12 border-l border-gray-300" />

              <div className="text-left sm:text-right">
                <p className="text-gray-500 text-sm font-medium">Credit Left</p>
                <p className="text-3xl font-bold text-emerald-500">{creditLeft.toFixed(1)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {(Object.keys(roleRules) as Role[]).map((role) => (
                <div key={role} className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-gray-700">{role}: {roleCounts[role]}</p>
                  <p className="text-xs text-gray-500">min {roleRules[role].min} / max {roleRules[role].max}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gray-100 p-2 mb-5">
              <div className="grid grid-cols-5 gap-1">
                {(["ALL", "WK", "BAT", "AR", "BOWL"] as const).map((role) => {
                  const isActive = activeRole === role;

                  return (
                    <button
                      key={role}
                      onClick={() => setActiveRole(role)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {visiblePlayers.map((player) => {
                const isSelected = selected.includes(player.id);
                const roleMaxed = roleCounts[player.role] >= roleRules[player.role].max;
                const isDisabled = !isSelected && (selected.length >= 11 || roleMaxed);

                return (
                  <button
                    key={player.id}
                    onClick={() => togglePlayer(player)}
                    disabled={isDisabled}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    } ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-semibold text-gray-900">{player.name}</p>
                          <span className="rounded-full border border-gray-300 px-3 py-0.5 text-xs font-semibold text-gray-700">
                            {player.role}
                          </span>
                        </div>
                        <p className="text-gray-500">{player.team}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{player.credit}</p>
                        <p className="text-xs font-medium text-gray-500">credits</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {!visiblePlayers.length && !playersError ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600 text-center">
                  No players available for this match.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="sticky bottom-4 z-20 max-w-[1100px] mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur px-4 py-3 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{selected.length}/11 selected</p>
              <p className="text-xs text-gray-500">
                Need valid role mix and team name to continue.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/dashboard/create-team/preview?selected=${encodeSelectedIds(selected)}&teamName=${encodeURIComponent(teamName.trim())}${teamId ? `&teamId=${teamId}` : ""}&captainId=${encodeURIComponent(captainId)}&viceCaptainId=${encodeURIComponent(viceCaptainId)}&matchId=${encodeURIComponent(matchMeta.matchId)}&league=${encodeURIComponent(matchMeta.league)}&date=${encodeURIComponent(matchMeta.date)}&time=${encodeURIComponent(matchMeta.time)}&team1=${encodeURIComponent(matchMeta.team1)}&team2=${encodeURIComponent(matchMeta.team2)}`,
                )
              }
              disabled={!isReadyForPreview}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-48 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl px-8 py-3 text-base font-semibold transition"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
