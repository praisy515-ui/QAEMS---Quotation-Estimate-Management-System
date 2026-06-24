import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

export default function DashboardCard({ title, value, icon: Icon, trend, trendType = "positive", delayClass = "" }) {
  const isPositive = trendType === "positive";

  return (
    <div className={`glass-card p-6 rounded-2xl flex flex-col justify-between h-32 animate-fade-in ${delayClass}`}>
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-semibold tracking-wider uppercase text-gray-400 font-display">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-bronze dark:bg-brand-gold/25 dark:text-brand-gold">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mt-4">
        <span className="text-2xl font-bold tracking-tight font-display text-brand-charcoal dark:text-brand-cream">
          <AnimatedCounter value={value} />
        </span>
        {trend && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
