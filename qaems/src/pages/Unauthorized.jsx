import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-brand-cream dark:bg-brand-charcoal text-center p-6 select-none relative overflow-hidden">
      {/* Glow decorative effects */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-brand-gold/5 blur-3xl"></div>

      <div className="z-10 max-w-md glass-panel p-8 rounded-2xl border dark:border-white/10 shadow-2xl flex flex-col items-center space-y-6 animate-scale-up">
        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20">
          <ShieldX className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-rose-600 dark:text-rose-450 uppercase tracking-wide">
            Access Denied
          </h1>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Your current security credentials do not grant access to this administrative workspace. Contact your IT team if this is an error.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="glass-btn-primary w-full flex items-center justify-center gap-2 text-xs py-3 font-semibold shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
