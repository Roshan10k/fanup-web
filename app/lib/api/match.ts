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

export const getMatches = async (token: string, status: string) => {
  try {
    const query = new URLSearchParams({ status, page: "1", size: "8" });
    const response = await axios.get(`${API.MATCHES.LIST}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to load matches"));
  }
};

export const completeMatchAndSettle = async (token: string, matchId: string) => {
  try {
    const response = await axios.patch(
      API.MATCHES.COMPLETE(matchId),
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