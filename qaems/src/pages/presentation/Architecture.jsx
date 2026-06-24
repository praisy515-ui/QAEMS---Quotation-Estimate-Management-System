import React from "react";
import { GitBranch, Database, FileCode, Workflow } from "lucide-react";

export default function Architecture() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <GitBranch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            System Architecture
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Structural diagrams and client-side data architecture.
          </p>
        </div>
      </div>

      {/* Grid: Component Layout & Schema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component Hierarchy */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold flex items-center gap-2 border-b pb-2 dark:border-white/10">
            <Workflow className="h-5 w-5" />
            Component & Navigation Architecture
          </h3>
          <div className="text-xs space-y-3 font-semibold text-gray-500 dark:text-gray-400 pl-2">
            <div className="border-l-2 border-brand-gold/30 pl-4 py-1">
              <span className="text-brand-bronze dark:text-brand-gold font-bold">App.jsx (Router Hub)</span>
              <p className="text-xxs text-gray-400 font-medium">AuthProvider & ThemeProvider wrapper states.</p>
              <div className="border-l border-gray-300 dark:border-white/10 pl-4 mt-2 space-y-1.5 font-medium">
                <p>├── <span className="text-brand-charcoal dark:text-brand-cream">Public Routes</span> (Landing Page, Login, Splash Screen)</p>
                <p>├── <span className="text-brand-charcoal dark:text-brand-cream">Route Gatekeeper</span> (Session Splashed check)</p>
                <p>└── <span className="text-brand-charcoal dark:text-brand-cream">Protected Workspace Layout</span> (Sidebar + Navbar wrapper)</p>
              </div>
            </div>
            <div className="border-l-2 border-brand-gold/30 pl-4 py-1">
              <span className="text-brand-bronze dark:text-brand-gold font-bold">Shared Layout Framework</span>
              <p className="text-xxs text-gray-400 font-medium">Global sidebar access triggers & search headers.</p>
              <div className="border-l border-gray-300 dark:border-white/10 pl-4 mt-2 space-y-1.5 font-medium">
                <p>├── <span className="text-brand-charcoal dark:text-brand-cream">Sidebar Menu Drawer</span> (Enforces role-based link exclusions)</p>
                <p>└── <span className="text-brand-charcoal dark:text-brand-cream">Global Navbar Header</span> (Universal Search + Notifications Drawer)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Database Schema (Local Storage) */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold flex items-center gap-2 border-b pb-2 dark:border-white/10">
            <Database className="h-5 w-5" />
            LocalStorage Local Database Keys
          </h3>
          <div className="space-y-3.5">
            <div>
              <span className="text-xxs font-bold uppercase tracking-wider text-brand-bronze dark:text-brand-gold">qaems_quotations</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Primary records: room sizing metrics, structural costs, scopes, and calculated GST amounts.</p>
            </div>
            <div>
              <span className="text-xxs font-bold uppercase tracking-wider text-brand-bronze dark:text-brand-gold">qaems_clients</span>
              <p className="text-[10px] text-gray-400 mt-0.5">CRM database matching customer contacts, conversion stages, and site-visit history timelines.</p>
            </div>
            <div>
              <span className="text-xxs font-bold uppercase tracking-wider text-brand-bronze dark:text-brand-gold">qaems_invoices</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Billing logs: dates, collections status (Paid/Pending/Overdue), bank transfer codes.</p>
            </div>
            <div>
              <span className="text-xxs font-bold uppercase tracking-wider text-brand-bronze dark:text-brand-gold">qaems_settings & qaems_logo</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Global parameters (GST percentage, default labour rates) and base64 string branding assets.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logic Data Flow */}
      <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
        <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold flex items-center gap-2 border-b pb-2 dark:border-white/10">
          <FileCode className="h-5 w-5" />
          Interactive Event State Pipeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center text-xs font-semibold">
          <div className="p-3 bg-brand-cream/60 dark:bg-brand-darkgray/30 rounded-xl border dark:border-white/5 space-y-1">
            <span className="text-brand-bronze dark:text-brand-gold font-bold">1. Event Trigger</span>
            <p className="text-xxs text-gray-400 font-medium">User inputs rooms or uploads a logo</p>
          </div>
          <div className="p-3 bg-brand-cream/60 dark:bg-brand-darkgray/30 rounded-xl border dark:border-white/5 space-y-1">
            <span className="text-brand-bronze dark:text-brand-gold font-bold">2. Calculations</span>
            <p className="text-xxs text-gray-400 font-medium">GST, material multipliers, & labor math run</p>
          </div>
          <div className="p-3 bg-brand-cream/60 dark:bg-brand-darkgray/30 rounded-xl border dark:border-white/5 space-y-1">
            <span className="text-brand-bronze dark:text-brand-gold font-bold">3. Service Sync</span>
            <p className="text-xxs text-gray-400 font-medium">Data is committed through service Layer</p>
          </div>
          <div className="p-3 bg-brand-cream/60 dark:bg-brand-darkgray/30 rounded-xl border dark:border-white/5 space-y-1">
            <span className="text-brand-bronze dark:text-brand-gold font-bold">4. Storage</span>
            <p className="text-xxs text-gray-400 font-medium">Saved to localStorage string models</p>
          </div>
          <div className="p-3 bg-brand-cream/60 dark:bg-brand-darkgray/30 rounded-xl border dark:border-white/5 space-y-1">
            <span className="text-brand-bronze dark:text-brand-gold font-bold">5. UI Broadcast</span>
            <p className="text-xxs text-gray-400 font-medium">Navbar and Sidebar state handlers trigger update</p>
          </div>
        </div>
      </div>
    </div>
  );
}
