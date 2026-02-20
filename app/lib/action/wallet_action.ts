"use server";

import { API } from "../api/endpoints";
import { getAuthToken, getUserData, setUserData } from "../cookie";

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

const makeAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getWalletSummaryAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.WALLET.SUMMARY}`, {
      method: "GET",
      headers: makeAuthHeaders(token),
      cache: "no-store",
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw);
    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message:
          payload?.message ||
          `Failed to fetch wallet summary (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data,
      message: payload?.message || "Wallet summary fetched",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch wallet summary"),
    };
  }
};

export const getWalletTransactionsAction = async (page = 1, size = 20) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    const response = await fetch(
      `${API_BASE_URL}${API.WALLET.TRANSACTIONS}?${query.toString()}`,
      {
        method: "GET",
        headers: makeAuthHeaders(token),
        cache: "no-store",
      }
    );

    const raw = await response.text();
    const payload = parseJsonSafe(raw);
    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message:
          payload?.message ||
          `Failed to fetch wallet transactions (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data || [],
      pagination: payload.pagination || null,
      message: payload?.message || "Wallet transactions fetched",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch wallet transactions"),
    };
  }
};

export const claimDailyBonusAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.WALLET.DAILY_BONUS}`, {
      method: "POST",
      headers: makeAuthHeaders(token),
      cache: "no-store",
      body: JSON.stringify({}),
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw);
    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message:
          payload?.message ||
          `Failed to claim daily bonus (HTTP ${response.status})`,
      };
    }

    const summary = payload?.data?.summary;
    if (summary) {
      const user = await getUserData();
      if (user) {
        await setUserData({
          ...user,
          balance: summary.balance,
        });
      }
    }

    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Daily bonus processed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to claim daily bonus"),
    };
  }
};

export const applyContestJoinDebitAction = async (input: {
  matchId: string;
  teamId: string;
}) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.WALLET.CONTEST_JOIN}`, {
      method: "POST",
      headers: makeAuthHeaders(token),
      cache: "no-store",
      body: JSON.stringify(input),
    });

    const raw = await response.text();
    const payload = parseJsonSafe(raw);
    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message:
          payload?.message ||
          `Failed to apply contest join debit (HTTP ${response.status})`,
      };
    }

    const summary = payload?.data?.summary;
    if (summary) {
      const user = await getUserData();
      if (user) {
        await setUserData({
          ...user,
          balance: summary.balance,
        });
      }
    }

    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Contest join debit processed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to apply contest join debit"),
    };
  }
};
