"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../_components/Sidebar";
import {
  decodeSelectedIds,
  encodeSelectedIds,
  getRoleCounts,
  isValidTeamComposition,
  matchInfo,
  mapBackendRoleToUiRole,
  players,
  roleRules,
  SAVED_TEAMS_STORAGE_KEY,
  type Role,
  type SavedTeam,
} from "../teamBuilder";

interface ApiPlayer {
  _id: string;
  fullName?: string;
  teamShortName?: string;
  role?: string;
  credit?: number;
}

const rowTop: Record<Role, string> = {
  WK: "13%",
  BAT: "32%",
  AR: "54%",
  BOWL: "77%",
};

const xSlotsByCount: Record<number, number[]> = {
  1: [50],
  2: [38, 62],
  3: [24, 50, 76],
  4: [14, 38, 62, 86],
};

export default function CreateTeamPreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedParam = searchParams.get("selected");
  const selected = useMemo(() => decodeSelectedIds(selectedParam), [selectedParam]);
  const [availablePlayers, setAvailablePlayers] = useState(players);
  const selectedPlayers = useMemo(
    () => availablePlayers.filter((player) => selected.includes(player.id)),
    [availablePlayers, selected]
  );
  const roleCounts = getRoleCounts(selected, availablePlayers);
  const teamName = searchParams.get("teamName")?.trim() || "My Team";
  const isReadonly = searchParams.get("readonly") === "1";
  const teamIdParam = searchParams.get("teamId");
  const editingTeamId = teamIdParam ? Number(teamIdParam) : null;
  const captainIdParam = searchParams.get("captainId") || "";
  const viceCaptainIdParam = searchParams.get("viceCaptainId") || "";
  const [isSaving, setIsSaving] = useState(false);
  const [playerPoints, setPlayerPoints] = useState<Record<string, number>>({});
  const [captainId, setCaptainId] = useState(captainIdParam);
  const [viceCaptainId, setViceCaptainId] = useState(viceCaptainIdParam);
  const matchMeta = useMemo(
    () => ({
      matchId: searchParams.get("matchId") || "",
      league: searchParams.get("league") || matchInfo.league,
      date: searchParams.get("date") || matchInfo.date,
      time: searchParams.get("time") || matchInfo.time,
      team1: searchParams.get("team1") || matchInfo.team1,
      team2: searchParams.get("team2") || matchInfo.team2,
    }),
    [searchParams]
  );

  const selectedByRole = useMemo(() => {
    return {
      WK: selectedPlayers.filter((player) => player.role === "WK"),
      BAT: selectedPlayers.filter((player) => player.role === "BAT"),
      AR: selectedPlayers.filter((player) => player.role === "AR"),
      BOWL: selectedPlayers.filter((player) => player.role === "BOWL"),
    };
  }, [selectedPlayers]);

  useEffect(() => {
    if (!captainId && selectedPlayers.length > 0) {
      setCaptainId(selectedPlayers[0].id);
    }
    if (!viceCaptainId && selectedPlayers.length > 1) {
      const fallbackVice = selectedPlayers[0].id === captainId ? selectedPlayers[1].id : selectedPlayers[0].id;
      setViceCaptainId(fallbackVice);
    }
  }, [captainId, viceCaptainId, selectedPlayers]);

  useEffect(() => {
    let isMounted = true;

    const loadPlayers = async () => {
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
          return;
        }

        const mapped = (payload.data as ApiPlayer[]).map((item) => ({
          id: String(item._id),
          name: String(item.fullName || "Player"),
          team: String(item.teamShortName || ""),
          role: mapBackendRoleToUiRole(String(item.role || "")),
          credit: Number(item.credit || 0),
        }));

        if (isMounted && mapped.length > 0) {
          setAvailablePlayers(mapped);
        }
      } catch {
        // Keep fallback static players when API load fails.
      }
    };

    void loadPlayers();
    return () => {
      isMounted = false;
    };
  }, [matchMeta.team1, matchMeta.team2]);

  const canSave =
    isValidTeamComposition(selected, availablePlayers) &&
    teamName.trim().length > 0 &&
    Boolean(captainId) &&
    Boolean(viceCaptainId) &&
    captainId !== viceCaptainId;

  const parseRuns = (value: string) => {
    const match = value.match(/^(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const parseWickets = (value: string) => {
    const match = value.match(/^(\d+)\//);
    return match ? Number(match[1]) : 0;
  };

  const arePointMapsEqual = (
    left: Record<string, number>,
    right: Record<string, number>
  ) => {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
      return false;
    }
    for (const key of leftKeys) {
      if (left[key] !== right[key]) {
        return false;
      }
    }
    return true;
  };

  const fetchSelectedPlayerPoints = useCallback(async () => {
    const basePoints = selectedPlayers.reduce<Record<string, number>>((acc, player) => {
      acc[player.name] = 0;
      return acc;
    }, {});

    if (!matchMeta.matchId) {
      return basePoints;
    }

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:3001";

    const response = await fetch(
      `${API_BASE_URL}/api/matches/${encodeURIComponent(matchMeta.matchId)}/scorecard`,
      { cache: "no-store" }
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.success) {
      return basePoints;
    }

    const scorecard = payload?.data?.scorecard;
    const topBatters = Array.isArray(scorecard?.topBatters) ? scorecard.topBatters : [];
    const topBowlers = Array.isArray(scorecard?.topBowlers) ? scorecard.topBowlers : [];
    const selectedNames = new Set(selectedPlayers.map((player) => player.name));

    const nextPoints = { ...basePoints };
    for (const entry of topBatters) {
      const playerName = String(entry?.playerName || "");
      if (selectedNames.has(playerName)) {
        nextPoints[playerName] = (nextPoints[playerName] || 0) + parseRuns(String(entry?.performance || ""));
      }
    }
    for (const entry of topBowlers) {
      const playerName = String(entry?.playerName || "");
      if (selectedNames.has(playerName)) {
        nextPoints[playerName] =
          (nextPoints[playerName] || 0) +
          parseWickets(String(entry?.performance || "")) * 25;
      }
    }

    return nextPoints;
  }, [matchMeta.matchId, selectedPlayers]);

  useEffect(() => {
    if (!isReadonly) {
      setPlayerPoints((prev) => (Object.keys(prev).length ? {} : prev));
      return;
    }

    let isMounted = true;

    const loadPlayerPoints = async () => {
      const points = await fetchSelectedPlayerPoints();
      if (isMounted) {
        setPlayerPoints((prev) => (arePointMapsEqual(prev, points) ? prev : points));
      }
    };

    void loadPlayerPoints();
    return () => {
      isMounted = false;
    };
  }, [fetchSelectedPlayerPoints, isReadonly]);

  const saveTeam = async () => {
    if (!canSave || isReadonly) {
      return;
    }

    setIsSaving(true);
    try {
      const pointsByPlayer = await fetchSelectedPlayerPoints();
      const points = selectedPlayers.reduce((sum, player) => {
        const base = pointsByPlayer[player.name] || 0;
        if (player.id === captainId) return sum + base * 2;
        if (player.id === viceCaptainId) return sum + base * 1.5;
        return sum + base;
      }, 0);
      const existingRaw = localStorage.getItem(SAVED_TEAMS_STORAGE_KEY);
      const existingTeams: SavedTeam[] = existingRaw ? (JSON.parse(existingRaw) as SavedTeam[]) : [];

      const savedTeam: SavedTeam = {
        id: editingTeamId ?? Date.now(),
        matchId: matchMeta.matchId || undefined,
        captainId,
        viceCaptainId,
        league: matchMeta.league,
        date: matchMeta.date,
        time: matchMeta.time,
        team1: matchMeta.team1,
        team2: matchMeta.team2,
        teamName,
        points,
        playerIds: selected,
      };

      const nextTeams =
        editingTeamId && existingTeams.some((team) => team.id === editingTeamId)
          ? existingTeams.map((team) => (team.id === editingTeamId ? savedTeam : team))
          : [savedTeam, ...existingTeams];

      localStorage.setItem(SAVED_TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
      router.push("/dashboard?tab=myteams");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] flex">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gray-400 font-semibold mb-2">Team Builder</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{teamName}</h1>
              <p className="text-gray-500 mt-1">
                {matchMeta.team1} vs {matchMeta.team2}, {matchMeta.date}
              </p>
            </div>

            <Link
              href={
                isReadonly
                  ? "/dashboard?tab=myteams"
                  : `/dashboard/create-team?selected=${encodeSelectedIds(selected)}&teamName=${encodeURIComponent(teamName)}${editingTeamId ? `&teamId=${editingTeamId}` : ""}&captainId=${encodeURIComponent(captainId)}&viceCaptainId=${encodeURIComponent(viceCaptainId)}&matchId=${encodeURIComponent(matchMeta.matchId)}&league=${encodeURIComponent(matchMeta.league)}&date=${encodeURIComponent(matchMeta.date)}&time=${encodeURIComponent(matchMeta.time)}&team1=${encodeURIComponent(matchMeta.team1)}&team2=${encodeURIComponent(matchMeta.team2)}`
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={16} />
              {isReadonly ? "Back to My Teams" : "Edit Team"}
            </Link>
          </div>

          <section className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 xl:p-7 shadow-sm">
            <div className="rounded-2xl bg-gray-100 p-4 md:p-5 flex flex-wrap items-center gap-3 mb-5">
              <div className="inline-flex items-center gap-2 mr-1">
                <Users size={18} className="text-gray-700" />
                <p className="text-lg font-semibold text-gray-900">{selected.length}/11 Players</p>
              </div>

              {(Object.keys(roleRules) as Role[]).map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700"
                >
                  {role}:{roleCounts[role]} ({roleRules[role].min}-{roleRules[role].max})
                </span>
              ))}
            </div>

            {!isReadonly ? (
              <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <label htmlFor="captainId" className="block text-xs font-semibold text-gray-500 mb-2">
                    Captain (2x)
                  </label>
                  <select
                    id="captainId"
                    value={captainId}
                    onChange={(event) => setCaptainId(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <option value="">Select captain</option>
                    {selectedPlayers.map((player) => (
                      <option key={player.id} value={player.id} disabled={player.id === viceCaptainId}>
                        {player.name} ({player.team})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <label htmlFor="viceCaptainId" className="block text-xs font-semibold text-gray-500 mb-2">
                    Vice Captain (1.5x)
                  </label>
                  <select
                    id="viceCaptainId"
                    value={viceCaptainId}
                    onChange={(event) => setViceCaptainId(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <option value="">Select vice captain</option>
                    {selectedPlayers.map((player) => (
                      <option key={player.id} value={player.id} disabled={player.id === captainId}>
                        {player.name} ({player.team})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            <div className="relative h-[560px] rounded-3xl border-2 border-emerald-500 overflow-hidden bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-400">
              <div className="absolute inset-5 rounded-[1.5rem] border border-emerald-100/70" />
              <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/80" />
              <div className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/80" />
              <div className="absolute left-1/2 top-1/2 h-44 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/80 bg-amber-200/35" />

              <div className="relative h-full w-full z-10">
                <PreviewRole role="WK" players={selectedByRole.WK} playerPoints={playerPoints} captainId={captainId} viceCaptainId={viceCaptainId} showPoints={isReadonly} />
                <PreviewRole role="BAT" players={selectedByRole.BAT} playerPoints={playerPoints} captainId={captainId} viceCaptainId={viceCaptainId} showPoints={isReadonly} />
                <PreviewRole role="AR" players={selectedByRole.AR} playerPoints={playerPoints} captainId={captainId} viceCaptainId={viceCaptainId} showPoints={isReadonly} />
                <PreviewRole role="BOWL" players={selectedByRole.BOWL} playerPoints={playerPoints} captainId={captainId} viceCaptainId={viceCaptainId} showPoints={isReadonly} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!isReadonly ? (
                <>
                  <Link
                    href={`/dashboard/create-team?selected=${encodeSelectedIds(selected)}&teamName=${encodeURIComponent(teamName)}${editingTeamId ? `&teamId=${editingTeamId}` : ""}&captainId=${encodeURIComponent(captainId)}&viceCaptainId=${encodeURIComponent(viceCaptainId)}&matchId=${encodeURIComponent(matchMeta.matchId)}&league=${encodeURIComponent(matchMeta.league)}&date=${encodeURIComponent(matchMeta.date)}&time=${encodeURIComponent(matchMeta.time)}&team1=${encodeURIComponent(matchMeta.team1)}&team2=${encodeURIComponent(matchMeta.team2)}`}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Edit Team
                  </Link>
                <button
                  onClick={saveTeam}
                  disabled={!canSave || isSaving}
                  className="rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 px-6 py-3.5 text-lg font-semibold text-white transition"
                >
                  {isSaving ? "Saving..." : "Save Team"}
                </button>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PreviewRole({
  role,
  players,
  playerPoints,
  captainId,
  viceCaptainId,
  showPoints,
}: {
  role: Role;
  players: Array<{ id: string; name: string }>;
  playerPoints: Record<string, number>;
  captainId: string;
  viceCaptainId: string;
  showPoints: boolean;
}) {
  const safeCount = Math.min(Math.max(players.length, 1), 4);
  const xSlots = xSlotsByCount[safeCount] || xSlotsByCount[4];

  if (players.length === 0) {
    return <PreviewPlayer name={`Pick ${role}`} role={role} top={rowTop[role]} left={`${xSlots[0]}%`} muted />;
  }

  return (
    <>
      {players.slice(0, 4).map((player, index) => (
        <PreviewPlayer
          key={`${role}-${player.id}`}
          name={player.name}
          role={role}
          top={rowTop[role]}
          left={`${xSlots[index]}%`}
          points={playerPoints[player.name] ?? 0}
          multiplier={
            player.id === captainId ? 2 : player.id === viceCaptainId ? 1.5 : 1
          }
          badge={
            player.id === captainId
              ? "C"
              : player.id === viceCaptainId
                ? "VC"
                : undefined
          }
          showPoints={showPoints}
        />
      ))}
    </>
  );
}

function PreviewPlayer({
  name,
  role,
  top,
  left,
  muted = false,
}: {
  name: string;
  role: Role;
  top: string;
  left: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 w-24 md:w-28 text-center ${muted ? "opacity-50" : "opacity-100"}`}
      style={{ top, left }}
    >
      <div className="mx-auto h-9 w-9 rounded-full bg-white/90 border border-emerald-900/15 shadow-sm" />
      <p className="text-[11px] md:text-xs font-semibold text-emerald-950 mt-1 truncate">{name}</p>
      <span className="inline-flex rounded-full border border-emerald-800/40 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-900 shadow-sm mt-1">
        {role}
      </span>
    </div>
  );
}
