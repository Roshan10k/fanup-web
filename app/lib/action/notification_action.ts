"use server";

import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notification";
import { getAuthToken } from "../cookie";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

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

export const getNotificationsAction = async (page = 1, size = 20) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getNotifications(token, page, size);
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

export const getUnreadCountAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getUnreadCount(token);
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

export const markAsReadAction = async (notificationId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await markNotificationAsRead(token, notificationId);
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

export const markAllAsReadAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await markAllNotificationsAsRead(token);
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

export const deleteNotificationAction = async (notificationId: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await deleteNotification(token, notificationId);
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
