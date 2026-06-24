import React from "react";

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-2xl border dark:border-white/5 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-3 w-20 bg-gray-250 dark:bg-white/10 rounded"></div>
        <div className="h-8 w-8 bg-gray-250 dark:bg-white/10 rounded-lg"></div>
      </div>
      <div className="h-6 w-24 bg-gray-200 dark:bg-white/15 rounded"></div>
      <div className="h-3 w-28 bg-gray-250 dark:bg-white/10 rounded"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 animate-pulse space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-32 bg-gray-200 dark:bg-white/15 rounded"></div>
        <div className="h-8 w-44 bg-gray-250 dark:bg-white/10 rounded-lg"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b dark:border-white/5 justify-between">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className={`h-3 bg-gray-200 dark:bg-white/15 rounded ${j === 0 ? "w-1/4" : "w-1/6"}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 animate-pulse space-y-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-4 w-36 bg-gray-200 dark:bg-white/15 rounded"></div>
        <div className="h-3 w-48 bg-gray-250 dark:bg-white/10 rounded"></div>
      </div>
      <div className="h-56 w-full flex items-end gap-3 pt-6">
        {Array.from({ length: 12 }).map((_, i) => {
          const heights = ["h-16", "h-24", "h-36", "h-20", "h-40", "h-48", "h-28", "h-32", "h-44", "h-12", "h-36", "h-24"];
          return (
            <div key={i} className={`flex-1 ${heights[i % heights.length]} bg-brand-gold/15 dark:bg-brand-gold/5 rounded-t`}></div>
          );
        })}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-panel p-8 rounded-2xl border dark:border-white/10 animate-pulse space-y-6">
      <div className="h-5 w-40 bg-gray-200 dark:bg-white/15 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-gray-250 dark:bg-white/10 rounded"></div>
            <div className="h-9 w-full bg-gray-200 dark:bg-white/15 rounded-lg"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <div className="h-9 w-24 bg-gray-250 dark:bg-white/10 rounded-lg"></div>
        <div className="h-9 w-32 bg-brand-gold/25 rounded-lg"></div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="h-10 w-10 bg-gray-250 dark:bg-white/10 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-200 dark:bg-white/15 rounded"></div>
          <div className="h-3 w-60 bg-gray-250 dark:bg-white/10 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
          <div className="h-4 w-32 bg-gray-250 dark:bg-white/10 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-white/15 rounded-xl"></div>
          <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-28 bg-gray-250 dark:bg-white/10 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-white/15 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
          <div className="h-4 w-24 bg-gray-250 dark:bg-white/10 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-white/15 rounded-xl"></div>
          <div className="h-16 bg-gray-200 dark:bg-white/15 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
