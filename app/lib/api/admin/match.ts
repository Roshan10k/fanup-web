import axios from "../axios";
import { API } from "../endpoints";
import { isAxiosError } from "axios";

const getAxiosErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const getAdminMatches = async (token: string, status?: string) => {
  try {
    const query = new URLSearchParams({ limit: "100" });
    if (status) query.append("status", status);
    const response = await axios.get(`${API.ADMIN.MATCHES}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to load matches"));
  }
};

export const getAdminMatchLeaderboard = async (token: string, matchId: string) => {
  try {
    const response = await axios.get(API.ADMIN.MATCH_LEADERBOARD(matchId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to load leaderboard"));
  }
};

export const lockMatch = async (token: string, matchId: string) => {
  try {
    const response = await axios.patch(
      API.ADMIN.LOCK_MATCH(matchId),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to lock match"));
  }
};

export const completeAndSettleMatch = async (token: string, matchId: string) => {
  try {
    const response = await axios.patch(
      API.ADMIN.COMPLETE_MATCH(matchId),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to complete and settle match"));
  }
};