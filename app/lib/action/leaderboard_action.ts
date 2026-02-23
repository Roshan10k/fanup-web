"use server";

import { API } from "../api/endpoints";
import { getAuthToken } from "../cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3001";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const parseJsonSafe = (raw: string): Record<string, unknown> => {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const getLeaderboardContestsAction = async (
  status: "upcoming" | "completed"
) => {
  try {
    const query = new URLSearchParams({ status });
    const response = await fetch(`${API_BASE_URL}${API.LEADERBOARD.CONTESTS}?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as { success?: boolean; message?: string; data?: unknown[] };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to load contests (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload?.data || [],
      message: payload?.message || "Contests loaded",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to load contests"),
    };
  }
};

export const getMatchLeaderboardAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.LEADERBOARD.CONTEST_BY_MATCH(matchId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as { success?: boolean; message?: string; data?: unknown };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to load leaderboard (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Leaderboard loaded",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to load leaderboard"),
    };
  }
};

export const getMyContestEntriesAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.LEADERBOARD.MY_ENTRIES}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as { success?: boolean; message?: string; data?: unknown[] };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to load my entries (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload?.data || [],
      message: payload?.message || "Contest entries loaded",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to load my entries"),
    };
  }
};

export const submitContestEntryAction = async (input: {
  matchId: string;
  teamId: string;
  teamName: string;
  captainId?: string;
  viceCaptainId?: string;
  playerIds: string[];
}) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.LEADERBOARD.SUBMIT_ENTRY(input.matchId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          teamId: input.teamId,
          teamName: input.teamName,
          captainId: input.captainId,
          viceCaptainId: input.viceCaptainId,
          playerIds: input.playerIds,
        }),
      }
    );

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as { success?: boolean; message?: string; data?: unknown };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to submit contest entry (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Contest entry submitted",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to submit contest entry"),
    };
  }
};

export const deleteContestEntryAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.LEADERBOARD.SUBMIT_ENTRY(matchId)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as { success?: boolean; message?: string };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to delete entry (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      message: payload?.message || "Contest entry deleted",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete entry"),
    };
  }
};
