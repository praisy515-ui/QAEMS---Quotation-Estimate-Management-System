import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import { TableSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { Bell, Check, CheckCircle2, Calendar, AlertTriangle, Info, Trash2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadNotifications().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadNotifications = async () => {
    try {
      const list = await quotationService.getNotifications();
      const mapped = list.map(n => ({ ...n, read: n.status === "Read" || n.read }));
      setNotifications(mapped);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await quotationService.markAllNotificationsRead();
      await loadNotifications();
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "approval":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "visit":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "rejection":
        return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCardBg = (read) => {
    return read
      ? "bg-white/40 border-gray-150 dark:bg-brand-darkgray/10 dark:border-white/5"
      : "bg-brand-gold/5 border-brand-gold/30 dark:bg-brand-gold/10 dark:border-brand-gold/20 shadow-sm";
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-white/10">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-250 dark:bg-white/10 rounded"></div>
            <div className="h-3.5 w-64 bg-gray-200 dark:bg-white/15 rounded"></div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-white/20 dark:bg-white/5 border border-white/25 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Notifications & Alerts
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Logs of quotation approvals, site visits scheduling, and system events.
            </p>
          </div>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="glass-btn-primary flex items-center justify-center gap-1.5 text-xs shadow-md cursor-pointer"
            id="notifications-mark-read-btn"
          >
            <Check className="h-4 w-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all animate-scale-up ${getCardBg(n.read)}`}
            >
              {/* Icon bubble */}
              <div className="p-2 rounded-lg bg-white dark:bg-brand-charcoal border dark:border-white/5">
                {getIcon(n.type)}
              </div>

              {/* Message */}
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-charcoal dark:text-brand-cream">{n.title}</span>
                  <span className="text-xxs text-gray-400 font-medium">{n.time}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{n.message}</p>
              </div>

              {/* Unread circle badge */}
              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-brand-bronze dark:bg-brand-gold shrink-0 self-center" />
              )}
            </div>
          ))
        ) : (
          <EmptyState
            icon={Bell}
            title="All caught up"
            description="You don't have any new unread notification logs or alert updates."
          />
        )}
      </div>
    </div>
  );
}