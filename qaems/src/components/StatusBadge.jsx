import React from "react";

export default function StatusBadge({ status }) {
  const normalizedStatus = String(status).trim().toLowerCase();

  const colorMap = {
    // Approved / Success states
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    
    pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    "under review": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    scheduled: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    "site visit": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    
    // Rejected / Cancelled / Error states
    rejected: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
    inactive: "bg-gray-150 text-gray-500 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/30",
    
    // General info / Workflow states
    "new enquiry": "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30",
    "design approval": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
    "quotation generated": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30",
    execution: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/30",
    draft: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-brand-darkgray dark:text-gray-300 dark:border-gray-700",
  };

  const styleClass = colorMap[normalizedStatus] || "bg-gray-50 text-gray-700 border-gray-200 dark:bg-brand-darkgray dark:text-gray-300 dark:border-gray-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${styleClass}`}>
      {status}
    </span>
  );
}
