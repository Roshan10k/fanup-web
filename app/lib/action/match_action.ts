"use server";

import { revalidatePath } from "next/cache";
import { completeMatchAndSettle, getMatches } from "../api/match";
import { getAuthToken } from "../cookie";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const getMatchesAction = async (status: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getMatches(token, status);
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

export const completeMatchAndSettleAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await completeMatchAndSettle(token, matchId);
    revalidatePath("/admin");
    return {
      success: true,
      data: payload?.data,
      message: payload?.message || "Match completed and settled",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to complete and settle match"),
    };
  }
};
