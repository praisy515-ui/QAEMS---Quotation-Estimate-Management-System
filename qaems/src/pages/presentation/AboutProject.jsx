import React from "react";
import { Info, HelpCircle, Award, Target, CheckCircle2 } from "lucide-react";

export default function AboutProject() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <Info className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            About the Project
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Glory Simon Interiors – Quotation & Estimate Management System (QAEMS).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Description */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Purpose & Scope
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
              In luxury interior design consulting, creating fast, accurate, and itemized quotations is crucial to closing sales and planning projects. **QAEMS** is a specialized SaaS workspace built for **Glory Simon Interiors** to automate manual calculations, track leads (CRM), schedule site audits, trace invoices, and manage vendors.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
              By replacing paper drafts and Excel spreadsheets, the platform empowers designers and project managers to generate itemized, client-ready proposals in seconds, and track their conversion milestones seamlessly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold flex items-center gap-2">
              <Award className="h-5 w-5" />
              Core System Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-charcoal dark:text-brand-cream">100% Client-Side Velocity</span>
                  <p className="text-xxs text-gray-400">Zero network delays; uses reactive Local Storage syncing.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-charcoal dark:text-brand-cream">Itemized Calculations</span>
                  <p className="text-xxs text-gray-400">Calculates flooring, modular cabinets, lighting, labour, and taxes instantly.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-charcoal dark:text-brand-cream">Workflow Pipeline</span>
                  <p className="text-xxs text-gray-400">A visual 9-stage Kanban pipeline tracking quotes from Enquiry to Completion.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-charcoal dark:text-brand-cream">Corporate Invoicing</span>
                  <p className="text-xxs text-gray-400">Print-ready bills, bank transfer sheets, and automatic revenue bookkeeping.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 text-center space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-brand-gold font-bold">Platform State</h4>
            <div className="text-3xl font-bold font-display text-brand-bronze dark:text-brand-gold">v2.8.0</div>
            <p className="text-xxs text-gray-400 font-medium leading-relaxed">
              Fully optimized frontend application ready for assessment.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-brand-bronze dark:text-brand-gold font-bold border-b pb-2 dark:border-white/10">
              Presentation Highlights
            </h4>
            <ul className="text-xxs font-semibold text-gray-500 dark:text-gray-400 space-y-2.5">
              <li className="flex justify-between">
                <span>Theme Preference:</span>
                <span className="text-brand-bronze dark:text-brand-gold">Light & Dark Modes</span>
              </li>
              <li className="flex justify-between">
                <span>Data Engine:</span>
                <span className="text-brand-bronze dark:text-brand-gold">Mock LocalStorage</span>
              </li>
              <li className="flex justify-between">
                <span>Print-Ready:</span>
                <span className="text-brand-bronze dark:text-brand-gold">Yes (A4 Optimizations)</span>
              </li>
              <li className="flex justify-between">
                <span>AI Simulator:</span>
                <span className="text-brand-bronze dark:text-brand-gold">Keyword-based NLP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
