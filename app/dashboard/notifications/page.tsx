"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Check, CheckCheck, Trash2, Trophy, Wallet, Users, Info } from "lucide-react";
import Sidebar from "../_components/Sidebar";
import ThemeToggle from "../_components/ThemeToggle";
import { useThemeMode } from "../_components/useThemeMode";
import {
  getNotificationsAction,
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
  type Notification,
} from "@/app/lib/action/notification_action";

export default function NotificationsPage() {
  const { isDark } = useThemeMode();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    totalPages: 1,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    const result = await getNotificationsAction(page, 20);
    if (result.success && result.data) {
      setNotifications(result.data.rows);
      setPagination(result.data.pagination);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string) => {
    setActionLoading(id);
    const result = await markAsReadAction(id);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
    setActionLoading(null);
  };

  const handleMarkAllAsRead = async () => {
    setActionLoading("all");
    const result = await markAllAsReadAction();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(`delete-${id}`);
    const result = await deleteNotificationAction(id);
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
    setActionLoading(null);
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "contest_joined":
        return Users;
      case "match_completed":
        return Trophy;
      case "prize_credited":
        return Wallet;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: Notification["type"], isDark: boolean) => {
    switch (type) {
      case "contest_joined":
        return isDark ? "text-blue-400" : "text-blue-600";
      case "match_completed":
        return isDark ? "text-purple-400" : "text-purple-600";
      case "prize_credited":
        return isDark ? "text-emerald-400" : "text-emerald-600";
      default:
        return isDark ? "text-gray-400" : "text-gray-600";
    }
  };

  const getNotificationBgColor = (type: Notification["type"], isDark: boolean) => {
    switch (type) {
      case "contest_joined":
        return isDark ? "bg-blue-500/10" : "bg-blue-50";
      case "match_completed":
        return isDark ? "bg-purple-500/10" : "bg-purple-50";
      case "prize_credited":
        return isDark ? "bg-emerald-500/10" : "bg-emerald-50";
      default:
        return isDark ? "bg-gray-500/10" : "bg-gray-50";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className={`text-2xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
            >
              Notifications
            </h1>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={actionLoading === "all"}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isDark
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                } ${actionLoading === "all" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${
                isDark ? "border-slate-500" : "border-gray-400"
              }`}
            />
            <p className={`mt-4 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border py-16 ${
              isDark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white"
            }`}
          >
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                isDark ? "bg-slate-800" : "bg-gray-100"
              }`}
            >
              <Bell size={28} className={isDark ? "text-slate-500" : "text-gray-400"} />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>
              No notifications yet
            </h3>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              When you join contests or win prizes, you&apos;ll see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type, isDark);
              const iconBgColor = getNotificationBgColor(notification.type, isDark);

              return (
                <div
                  key={notification.id}
                  className={`group relative flex items-start gap-4 rounded-2xl border p-4 transition ${
                    notification.isRead
                      ? isDark
                        ? "border-slate-800 bg-slate-900/30"
                        : "border-gray-200 bg-white"
                      : isDark
                        ? "border-slate-700 bg-slate-800/50"
                        : "border-gray-300 bg-white shadow-sm"
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <span
                      className={`absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${
                        isDark ? "bg-red-400" : "bg-red-500"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgColor}`}
                  >
                    <IconComponent size={20} className={iconColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-semibold ${
                          isDark ? "text-slate-100" : "text-gray-900"
                        } ${notification.isRead ? "font-medium" : ""}`}
                      >
                        {notification.title}
                      </h3>
                      <span
                        className={`shrink-0 text-xs ${
                          isDark ? "text-slate-500" : "text-gray-400"
                        }`}
                      >
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-sm ${
                        isDark ? "text-slate-400" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex items-center gap-1 opacity-0 transition group-hover:opacity-100`}
                  >
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={actionLoading === notification.id}
                        className={`rounded-lg p-2 transition ${
                          isDark
                            ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        } ${actionLoading === notification.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      disabled={actionLoading === `delete-${notification.id}`}
                      className={`rounded-lg p-2 transition ${
                        isDark
                          ? "hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          : "hover:bg-red-50 text-gray-500 hover:text-red-600"
                      } ${actionLoading === `delete-${notification.id}` ? "opacity-50 cursor-not-allowed" : ""}`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => loadNotifications(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                        page === pagination.page
                          ? isDark
                            ? "bg-red-500 text-white"
                            : "bg-red-500 text-white"
                          : isDark
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
