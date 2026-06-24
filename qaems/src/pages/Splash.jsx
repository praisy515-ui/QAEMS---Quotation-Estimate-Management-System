import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("qaems_splashed", "true");
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-brand-charcoal text-white select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-charcoal to-[#2d2f34] opacity-80"></div>
      
      {/* Decorative architectural circle outline */}
      <div className="absolute h-96 w-96 rounded-full border border-brand-gold/10 flex items-center justify-center animate-pulse">
        <div className="h-80 w-80 rounded-full border border-brand-gold/5"></div>
      </div>

      <div className="z-10 flex flex-col items-center space-y-6 text-center">
        {/* Brand Logo Bubble */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gold text-brand-charcoal font-bold text-3xl font-display shadow-lg shadow-brand-gold/10 animate-bounce">
          G
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-widest text-brand-cream uppercase">
            Glory Simon Interiors
          </h1>
          <p className="text-xs uppercase tracking-widest text-brand-gold/80 font-semibold font-display">
            Quotation & Estimate Management System
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-brand-gold rounded-full w-2/3 absolute animate-shimmer"></div>
        </div>
      </div>

      {/* Styled css keyframe injected directly */}
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; width: 50%; }
          50% { width: 30%; }
          100% { left: 100%; width: 50%; }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
