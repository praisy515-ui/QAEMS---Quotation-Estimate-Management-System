import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-xs">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-all dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-brand-cream"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-2 flex items-center p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
