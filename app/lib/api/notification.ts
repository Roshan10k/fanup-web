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

export const getNotifications = async (token: string, page: number, size: number) => {
  try {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    const response = await axios.get(`${API.NOTIFICATIONS.LIST}?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch notifications"));
  }
};

export const getUnreadCount = async (token: string) => {
  try {
    const response = await axios.get(API.NOTIFICATIONS.UNREAD_COUNT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch unread count"));
  }
};

export const markNotificationAsRead = async (token: string, notificationId: string) => {
  try {
    const response = await axios.patch(
      API.NOTIFICATIONS.MARK_READ(notificationId),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to mark notification as read"));
  }
};

export const markAllNotificationsAsRead = async (token: string) => {
  try {
    const response = await axios.patch(
      API.NOTIFICATIONS.MARK_ALL_READ,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to mark all notifications as read"));
  }
};

export const deleteNotification = async (token: string, notificationId: string) => {
  try {
    const response = await axios.delete(API.NOTIFICATIONS.DELETE(notificationId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to delete notification"));
  }
};