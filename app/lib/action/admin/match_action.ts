"use server";

import {
  completeAndSettleMatch,
  getAdminMatchLeaderboard,
  getAdminMatches,
  lockMatch,
} from "../../api/admin/match";
import { getAuthToken } from "../../cookie";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const getAdminMatchesAction = async (status?: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getAdminMatches(token, status);
    return {
      success: true,
      data: payload?.data || [],
      message: payload?.message || "Matches loaded",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to load matches"),
    };
  }
};

export const getAdminMatchLeaderboardAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getAdminMatchLeaderboard(token, matchId);
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

export const lockMatchAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await lockMatch(token, matchId);
    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Match locked successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to lock match"),
    };
  }
};

export const completeAndSettleMatchAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await completeAndSettleMatch(token, matchId);
    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Match completed and settled successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to complete and settle match"),
    };
  }
};
