"use server";

import {
  applyContestJoinDebit,
  claimDailyBonus,
  getWalletSummary,
  getWalletTransactions,
} from "../api/wallet";
import { getAuthToken, getUserData, setUserData } from "../cookie";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const getWalletSummaryAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getWalletSummary(token);
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

    const payload = await getWalletTransactions(token, page, size);
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

    const payload = await claimDailyBonus(token);
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

    const payload = await applyContestJoinDebit(token, input);
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
