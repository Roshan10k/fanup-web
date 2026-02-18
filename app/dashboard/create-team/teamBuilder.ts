export type Role = "WK" | "BAT" | "AR" | "BOWL";

export type Player = {
  id: number;
  name: string;
  team: "IND" | "AUS";
  role: Role;
  credit: number;
};

export type SavedTeam = {
  id: number;
  league: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  teamName: string;
  points: number;
  playerIds: number[];
};

export const SAVED_TEAMS_STORAGE_KEY = "fanup_saved_teams";

export const matchInfo = {
  league: "NPL",
  date: "4th Nov, 26",
  time: "3:15 PM",
  team1: "IND",
  team2: "AUS",
};

export const roleRules: Record<Role, { min: number; max: number }> = {
  WK: { min: 1, max: 2 },
  BAT: { min: 3, max: 4 },
  AR: { min: 1, max: 4 },
  BOWL: { min: 3, max: 4 },
};

export const players: Player[] = [
  { id: 1, name: "Rohit Sharma", team: "IND", role: "WK", credit: 10 },
  { id: 2, name: "Josh Inglis", team: "AUS", role: "WK", credit: 9 },
  { id: 3, name: "Virat Kohli", team: "IND", role: "BAT", credit: 10 },
  { id: 4, name: "Shubman Gill", team: "IND", role: "BAT", credit: 9 },
  { id: 5, name: "Travis Head", team: "AUS", role: "BAT", credit: 9 },
  { id: 6, name: "Marnus Labuschagne", team: "AUS", role: "BAT", credit: 8 },
  { id: 7, name: "Hardik Pandya", team: "IND", role: "AR", credit: 10 },
  { id: 8, name: "Ravindra Jadeja", team: "IND", role: "AR", credit: 9 },
  { id: 9, name: "Glenn Maxwell", team: "AUS", role: "AR", credit: 9 },
  { id: 10, name: "Jasprit Bumrah", team: "IND", role: "BOWL", credit: 9 },
  { id: 11, name: "Mitchell Starc", team: "AUS", role: "BOWL", credit: 9 },
  { id: 12, name: "Mohammed Siraj", team: "IND", role: "BOWL", credit: 8 },
];

export function decodeSelectedIds(value: string | null): number[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
}

export function encodeSelectedIds(ids: number[]): string {
  return ids.join(",");
}

export function getRoleCounts(selectedIds: number[]): Record<Role, number> {
  const selectedPlayers = players.filter((player) => selectedIds.includes(player.id));
  return {
    WK: selectedPlayers.filter((player) => player.role === "WK").length,
    BAT: selectedPlayers.filter((player) => player.role === "BAT").length,
    AR: selectedPlayers.filter((player) => player.role === "AR").length,
    BOWL: selectedPlayers.filter((player) => player.role === "BOWL").length,
  };
}

export function isValidTeamComposition(selectedIds: number[]): boolean {
  if (selectedIds.length !== 11) {
    return false;
  }

  const counts = getRoleCounts(selectedIds);

  return (Object.keys(roleRules) as Role[]).every((role) => {
    const count = counts[role];
    return count >= roleRules[role].min && count <= roleRules[role].max;
  });
}
