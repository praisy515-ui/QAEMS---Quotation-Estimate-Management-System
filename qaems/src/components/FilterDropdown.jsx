import React from "react";
import { Filter } from "lucide-react";

export default function FilterDropdown({ value, onChange, options, label }) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:inline">
          {label}:
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-8 pr-8 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold cursor-pointer transition-all dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-brand-cream"
          id={`filter-${label ? label.toLowerCase().replace(/\s/g, "-") : "dropdown"}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
