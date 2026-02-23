"use server";

import { API } from "../../api/endpoints";
import { getAuthToken } from "../../cookie";

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

/**
 * Get all matches for admin dropdown
 * status: optional comma-separated (upcoming,locked,completed)
 */
export const getAdminMatchesAction = async (status?: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const query = new URLSearchParams();
    if (status) query.append("status", status);
    query.append("limit", "100");

    const response = await fetch(
      `${API_BASE_URL}${API.ADMIN.MATCHES}?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as {
      success?: boolean;
      message?: string;
      data?: unknown[];
    };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to load matches (HTTP ${response.status})`,
      };
    }

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

/**
 * Get leaderboard for a specific match (admin view)
 */
export const getAdminMatchLeaderboardAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.ADMIN.MATCH_LEADERBOARD(matchId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as {
      success?: boolean;
      message?: string;
      data?: unknown;
    };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message:
          payload?.message || `Failed to load leaderboard (HTTP ${response.status})`,
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

/**
 * Lock a match (users can no longer join or edit teams)
 */
export const lockMatchAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.ADMIN.LOCK_MATCH(matchId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as {
      success?: boolean;
      message?: string;
      data?: unknown;
    };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message || `Failed to lock match (HTTP ${response.status})`,
      };
    }

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

/**
 * Complete and settle a match (distribute prizes)
 */
export const completeAndSettleMatchAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.ADMIN.COMPLETE_MATCH(matchId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({}),
      }
    );

    const raw = await response.text();
    const payload = parseJsonSafe(raw) as {
      success?: boolean;
      message?: string;
      data?: unknown;
    };

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message:
          payload?.message ||
          `Failed to complete and settle match (HTTP ${response.status})`,
      };
    }

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
