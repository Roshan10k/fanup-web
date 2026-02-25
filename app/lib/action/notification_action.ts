"use server";

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

const makeAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export interface Notification {
  id: string;
  type: "contest_joined" | "match_completed" | "prize_credited" | "system";
  title: string;
  message: string;
  referenceId?: string | null;
  referenceType?: "match" | "contest" | "wallet" | null;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  rows: Notification[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get notifications for the current user
 */
export const getNotificationsAction = async (page = 1, size = 20) => {
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
      `${API_BASE_URL}${API.NOTIFICATIONS.LIST}?${query.toString()}`,
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
          `Failed to fetch notifications (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data as NotificationListResponse,
      message: payload?.message || "Notifications fetched",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch notifications"),
    };
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCountAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.NOTIFICATIONS.UNREAD_COUNT}`,
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
          `Failed to fetch unread count (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data as { count: number },
      message: payload?.message || "Unread count fetched",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch unread count"),
    };
  }
};

/**
 * Mark a notification as read
 */
export const markAsReadAction = async (notificationId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.NOTIFICATIONS.MARK_READ(notificationId)}`,
      {
        method: "PATCH",
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
          `Failed to mark notification as read (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data,
      message: payload?.message || "Notification marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to mark notification as read"),
    };
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsReadAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.NOTIFICATIONS.MARK_ALL_READ}`,
      {
        method: "PATCH",
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
          `Failed to mark all notifications as read (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data as { markedCount: number },
      message: payload?.message || "All notifications marked as read",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to mark all notifications as read"),
    };
  }
};

/**
 * Delete a notification
 */
export const deleteNotificationAction = async (notificationId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API.NOTIFICATIONS.DELETE(notificationId)}`,
      {
        method: "DELETE",
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
          `Failed to delete notification (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      data: payload.data,
      message: payload?.message || "Notification deleted",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete notification"),
    };
  }
};
