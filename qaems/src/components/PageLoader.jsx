import React from "react";
import { Compass } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-6 select-none animate-pulse">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full bg-brand-gold/10 blur-xl animate-ping"></div>
        {/* Inner golden loader */}
        <div className="relative p-6 bg-white/40 dark:bg-brand-darkgray/40 border border-brand-gold/30 rounded-2xl shadow-xl flex items-center justify-center">
          <Compass className="h-10 w-10 text-brand-gold animate-spin-slow" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold">Loading Workspace</h3>
        <p className="text-xxs text-gray-400 font-medium">Glory Simon Interiors</p>
      </div>
    </div>
  );
}
