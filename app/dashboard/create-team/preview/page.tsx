"use client";

import { useMemo } from "react";
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
  players,
  roleRules,
  SAVED_TEAMS_STORAGE_KEY,
  type Role,
  type SavedTeam,
} from "../teamBuilder";

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

  const selected = decodeSelectedIds(searchParams.get("selected"));
  const selectedPlayers = useMemo(() => players.filter((player) => selected.includes(player.id)), [selected]);
  const roleCounts = getRoleCounts(selected);
  const teamName = searchParams.get("teamName")?.trim() || "My Team";
  const isReadonly = searchParams.get("readonly") === "1";
  const teamIdParam = searchParams.get("teamId");
  const editingTeamId = teamIdParam ? Number(teamIdParam) : null;

  const selectedByRole = useMemo(() => {
    return {
      WK: selectedPlayers.filter((player) => player.role === "WK"),
      BAT: selectedPlayers.filter((player) => player.role === "BAT"),
      AR: selectedPlayers.filter((player) => player.role === "AR"),
      BOWL: selectedPlayers.filter((player) => player.role === "BOWL"),
    };
  }, [selectedPlayers]);

  const canSave = isValidTeamComposition(selected) && teamName.trim().length > 0;

  const saveTeam = () => {
    if (!canSave || isReadonly) {
      return;
    }

    const existingRaw = localStorage.getItem(SAVED_TEAMS_STORAGE_KEY);
    const existingTeams: SavedTeam[] = existingRaw ? (JSON.parse(existingRaw) as SavedTeam[]) : [];

    const savedTeam: SavedTeam = {
      id: editingTeamId ?? Date.now(),
      league: matchInfo.league,
      date: matchInfo.date,
      time: matchInfo.time,
      team1: matchInfo.team1,
      team2: matchInfo.team2,
      teamName,
      points: 0,
      playerIds: selected,
    };

    const nextTeams =
      editingTeamId && existingTeams.some((team) => team.id === editingTeamId)
        ? existingTeams.map((team) => (team.id === editingTeamId ? savedTeam : team))
        : [savedTeam, ...existingTeams];

    localStorage.setItem(SAVED_TEAMS_STORAGE_KEY, JSON.stringify(nextTeams));
    router.push("/dashboard?tab=myteams");
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
                {matchInfo.team1} vs {matchInfo.team2}, {matchInfo.date}
              </p>
            </div>

            <Link
              href={`/dashboard/create-team?selected=${encodeSelectedIds(selected)}&teamName=${encodeURIComponent(teamName)}${editingTeamId ? `&teamId=${editingTeamId}` : ""}`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={16} />
              {isReadonly ? "Back" : "Edit Team"}
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

            <div className="relative h-[560px] rounded-3xl border-2 border-emerald-500 overflow-hidden bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-400">
              <div className="absolute inset-5 rounded-[1.5rem] border border-emerald-100/70" />
              <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/80" />
              <div className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/80" />
              <div className="absolute left-1/2 top-1/2 h-44 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/80 bg-amber-200/35" />

              <div className="relative h-full w-full z-10">
                <PreviewRole role="WK" names={selectedByRole.WK.map((player) => player.name)} />
                <PreviewRole role="BAT" names={selectedByRole.BAT.map((player) => player.name)} />
                <PreviewRole role="AR" names={selectedByRole.AR.map((player) => player.name)} />
                <PreviewRole role="BOWL" names={selectedByRole.BOWL.map((player) => player.name)} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/dashboard/create-team?selected=${encodeSelectedIds(selected)}&teamName=${encodeURIComponent(teamName)}${editingTeamId ? `&teamId=${editingTeamId}` : ""}`}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Edit Team
              </Link>
              {!isReadonly && (
                <button
                  onClick={saveTeam}
                  disabled={!canSave}
                  className="rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 px-6 py-3.5 text-lg font-semibold text-white transition"
                >
                  Save Team
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PreviewRole({ role, names }: { role: Role; names: string[] }) {
  const safeCount = Math.min(Math.max(names.length, 1), 4);
  const xSlots = xSlotsByCount[safeCount] || xSlotsByCount[4];

  if (names.length === 0) {
    return <PreviewPlayer name={`Pick ${role}`} role={role} top={rowTop[role]} left={`${xSlots[0]}%`} muted />;
  }

  return (
    <>
      {names.slice(0, 4).map((name, index) => (
        <PreviewPlayer key={`${role}-${name}`} name={name} role={role} top={rowTop[role]} left={`${xSlots[index]}%`} />
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
