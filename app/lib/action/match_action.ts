"use server";

import { revalidatePath } from "next/cache";
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

export const getMatchesAction = async (status: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const query = new URLSearchParams({ status, page: "1", size: "8" });
    const response = await fetch(
      `${API_BASE_URL}${API.MATCHES.LIST}?${query.toString()}`,
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

export const completeMatchAndSettleAction = async (matchId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(`${API_BASE_URL}${API.MATCHES.COMPLETE(matchId)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({}),
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
        message:
          payload?.message || `Failed to complete and settle match (HTTP ${response.status})`,
      };
    }

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
