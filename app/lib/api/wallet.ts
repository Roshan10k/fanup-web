import axios from "./axios";
import { isAxiosError } from "axios";
import { API } from "./endpoints";

const getAxiosErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const getWalletSummary = async (token: string) => {
  try {
    const response = await axios.get(API.WALLET.SUMMARY, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch wallet summary"));
  }
};

export const getWalletTransactions = async (token: string, page: number, size: number) => {
  try {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    const response = await axios.get(`${API.WALLET.TRANSACTIONS}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch wallet transactions"));
  }
};

export const claimDailyBonus = async (token: string) => {
  try {
    const response = await axios.post(
      API.WALLET.DAILY_BONUS,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to claim daily bonus"));
  }
};

export const applyContestJoinDebit = async (
  token: string,
  input: { matchId: string; teamId: string }
) => {
  try {
    const response = await axios.post(API.WALLET.CONTEST_JOIN, input, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to apply contest join debit"));
  }
};