import React from "react";
import { Cpu, Layout, Paintbrush, LineChart, Shield, Code } from "lucide-react";

export default function TechStack() {
  const techs = [
    {
      icon: Code,
      name: "React 19 Core Framework",
      desc: "Functional Components, Custom hooks (useAuth, useTheme), state variables synchronization, and context providers for session-wide state containment."
    },
    {
      icon: Paintbrush,
      name: "Tailwind CSS v4",
      desc: "Modern atomic styling utilizing Vite plugin-based compilers. Custom themes defined inside index.css provide branding cream, dark-gray, and luxury gold variables."
    },
    {
      icon: Layout,
      name: "React Router DOM v7",
      desc: "Client-side routing with nested layout nesting, public-page exclusions, splash checks, and custom gatekeeper route redirect nodes."
    },
    {
      icon: LineChart,
      name: "Recharts Visualization",
      desc: "Responsive SVG area, bar, and pie charts used for monthly quotation metrics, revenue auditing, and CRM conversion tracking."
    },
    {
      icon: Cpu,
      name: "Vite Development Engine",
      desc: "Hot Module Replacement (HMR) bundler compiling 2,300+ modules into highly optimized chunk outputs under 750 milliseconds."
    },
    {
      icon: Shield,
      name: "Local Storage Database",
      desc: "Client-side persistence database storing authentication tokens, invoice tables, site audit events, settings variables, and company logos."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <Cpu className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            Technology Stack
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Frontend library specifications and bundler configurations.
          </p>
        </div>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techs.map((t, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="p-2.5 bg-brand-gold/10 text-brand-bronze dark:bg-brand-gold/15 dark:text-brand-gold rounded-lg self-start w-fit border border-brand-gold/20">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold font-display text-brand-charcoal dark:text-brand-cream">
                {t.name}
              </h3>
              <p className="text-xxs text-gray-400 font-medium leading-relaxed">
                {t.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
