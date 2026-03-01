"use server";

import {
  deleteContestEntry,
  getLeaderboardContests,
  getMatchLeaderboard,
  getMyContestEntries,
  submitContestEntry,
} from "../api/leaderboard";
import { getAuthToken } from "../cookie";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const getLeaderboardContestsAction = async (
  status: "upcoming" | "completed"
) => {
  try {
    const payload = await getLeaderboardContests(status);
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

    const payload = await getMatchLeaderboard(token, matchId);
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

    const payload = await getMyContestEntries(token);
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

    const payload = await submitContestEntry(token, input);
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

    const payload = await deleteContestEntry(token, matchId);
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
