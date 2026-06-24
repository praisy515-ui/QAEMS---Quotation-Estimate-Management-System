import React from "react";
import { Users, Mail, Award, CheckCircle } from "lucide-react";

export default function TeamInfo() {
  const members = [
    {
      name: "Alex Rivera",
      role: "Lead Full-Stack Developer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      email: "alex.r@example.com",
      contribution: "Designed local storage service controllers, authentication providers, and universal global search indexing."
    },
    {
      name: "Sarah Jenkins",
      role: "UI/UX & Product Designer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      email: "sarah.j@example.com",
      contribution: "Designed custom CSS glassmorphism widgets, luxury color tokens, and responsive sidebar drawers."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            Team Information
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Internship project developers, coordinators, and credit boards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Members List */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {members.map((m, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border dark:border-white/10 flex flex-col items-center text-center space-y-4 shadow-sm">
                <img src={m.avatar} alt={m.name} className="h-16 w-16 rounded-full border border-brand-gold/45 object-cover" />
                <div>
                  <h3 className="text-sm font-bold font-display text-brand-charcoal dark:text-brand-cream">{m.name}</h3>
                  <span className="text-xxs text-brand-bronze dark:text-brand-gold font-bold uppercase tracking-wider">{m.role}</span>
                </div>
                <div className="text-xxs text-gray-400 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{m.email}</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed border-t dark:border-white/5 pt-3 w-full">
                  {m.contribution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Mentor & Credits */}
        <div className="space-y-6">
          {/* Mentor Profile */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-brand-bronze dark:text-brand-gold font-bold border-b pb-2 dark:border-white/10 flex items-center gap-2">
              <Award className="h-4.5 w-4.5" />
              Internship Mentor
            </h3>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                alt="Glory Simon"
                className="h-12 w-12 rounded-full object-cover border border-brand-gold/50"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Glory Simon</span>
                <span className="text-xxs text-gray-400">Founder & Chief Architect</span>
                <span className="text-[9px] text-brand-gold font-semibold uppercase tracking-wider">Glory Simon Interiors</span>
              </div>
            </div>
          </div>

          {/* Internship Board info */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-3.5 text-xxs font-semibold text-gray-500 dark:text-gray-400">
            <div className="flex justify-between items-center pb-2 border-b dark:border-white/5">
              <span>Department:</span>
              <span className="text-brand-bronze dark:text-brand-gold">Interior Design IT</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-white/5">
              <span>Term:</span>
              <span className="text-brand-bronze dark:text-brand-gold">Summer 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle className="h-3 w-3" />
                Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
