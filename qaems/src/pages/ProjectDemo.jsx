import React, { useState } from "react";
import { useTour } from "../context/TourContext";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Database,
  Users,
  Compass,
  Cpu,
  Monitor,
  CheckCircle,
  FileText,
  MessageSquare,
  DollarSign,
  TrendingUp,
  LayoutGrid,
  ChevronRight,
  Smartphone
} from "lucide-react";

export default function ProjectDemo() {
  const { startTour } = useTour();
  const [activeTab, setActiveTab] = useState("architecture");

  // Mock Screenshot gallery of modules represented as premium interactive card templates
  const modules = [
    {
      id: "dashboard",
      name: "Executive Dashboard",
      desc: "Central command center displaying real-time financial metrics, quotation volume KPIs, conversion rates, and quick action widgets.",
      icon: LayoutGrid,
      color: "from-amber-500/20 to-yellow-500/20",
      accent: "text-amber-500"
    },
    {
      id: "crm",
      name: "Customer CRM",
      desc: "Customer lifecycle tracker supporting profile building, search filters, and recent project activity stream timeline tracking.",
      icon: Users,
      color: "from-blue-500/20 to-indigo-500/20",
      accent: "text-blue-500"
    },
    {
      id: "builder",
      name: "Quotation Builder",
      desc: "Comprehensive calculation engine matching room dimensions, design selections, materials, lighting, labor, taxes, and customer discounts.",
      icon: Cpu,
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-500"
    },
    {
      id: "preview",
      name: "Estimate Preview & Print",
      desc: "PDF-formatted proposal generator featuring business branding, itemized tables, GST computation, and layout printing.",
      icon: FileText,
      color: "from-purple-500/20 to-pink-500/20",
      accent: "text-purple-500"
    },
    {
      id: "payments",
      name: "Invoice & Billing Management",
      desc: "Financial registry managing invoice statuses (Paid, Pending, Overdue), revenue counters, and payment receipt exports.",
      icon: DollarSign,
      color: "from-rose-500/20 to-orange-500/20",
      accent: "text-rose-500"
    },
    {
      id: "workflow",
      name: "Kanban Project Workflow",
      desc: "Interactive status board charting design projects through concept, sourcing, site prep, installation, and final handover.",
      icon: Compass,
      color: "from-cyan-500/20 to-blue-500/20",
      accent: "text-cyan-500"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-slide-in pb-12">
      {/* Premium Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-charcoal to-brand-darkgray text-brand-cream border border-brand-gold/30 shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-brand-bronze/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 text-brand-gold border border-brand-gold/20 rounded-full text-xxs font-extrabold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Academic Presentation Portfolio</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight">
              Quotation & Estimate Management System (QAEMS)
            </h1>
            <p className="text-lg md:text-xl font-serif italic text-brand-gold">
              "Designing Spaces, Building Dreams."
            </p>
          </div>

          <p className="text-sm text-gray-300 font-medium max-w-2xl leading-relaxed">
            A premium production-ready React client workspace built for <span className="text-white font-bold">Glory Simon Interiors</span> to automate estimating, streamline customer CRM lifecycles, coordinate team workflows, and manage project billing cycles.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={startTour}
              className="px-6 py-3.5 bg-gradient-to-r from-brand-bronze to-brand-gold text-brand-charcoal hover:text-white dark:text-brand-charcoal hover:brightness-110 shadow-xl font-bold text-xs rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>Start Guided Workspace Tour</span>
              <ArrowRight className="h-4 w-4 animate-bounce-horizontal" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Problem Statement and Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 dark:border-white/5 space-y-4">
          <h2 className="text-lg font-bold text-brand-bronze dark:text-brand-gold uppercase tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            Problem Statement
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            Glory Simon Interiors faced operational bottlenecks due to manual calculation sheets, fragmented communication channels, and slow client quotation times. The lack of standard item coefficients caused margin leakage, while separate task and invoice lists hindered project oversight.
          </p>
          <ul className="space-y-2 text-xxs font-semibold text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span> Margin calculations vulnerable to human math errors.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span> Delays of up to 48 hours in delivering final proposals to clients.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span> Absence of structured status visibility across ongoing site visits and builds.
            </li>
          </ul>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 dark:border-white/5 space-y-4">
          <h2 className="text-lg font-bold text-brand-bronze dark:text-brand-gold uppercase tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Project Objectives
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            To design and implement a comprehensive digital ecosystem that accelerates proposal generation, controls design margin leakages, coordinates cross-role tasks, and delivers a unified hub to manage accounts.
          </p>
          <ul className="space-y-2 text-xxs font-semibold text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span> Build a rules-based quotation compiler with material and labor coefficients.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span> Standardize print-ready proposal exports with integrated GST validation.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span> Provide real-time status pipelines for site engineers, designers, and managers.
            </li>
          </ul>
        </div>
      </div>

      {/* Diagrams Section with Navigation Tabs */}
      <div className="glass-panel rounded-2xl border border-white/10 dark:border-white/5 overflow-hidden">
        <div className="flex border-b border-gray-150 dark:border-white/5 bg-gray-50 dark:bg-brand-charcoal/20">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "architecture"
                ? "bg-white dark:bg-brand-charcoal text-brand-bronze dark:text-brand-gold border-b-2 border-brand-gold"
                : "text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream"
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "workflow"
                ? "bg-white dark:bg-brand-charcoal text-brand-bronze dark:text-brand-gold border-b-2 border-brand-gold"
                : "text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream"
            }`}
          >
            System Workflow Model
          </button>
        </div>

        <div className="p-8">
          {activeTab === "architecture" ? (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-brand-charcoal dark:text-brand-cream text-center uppercase tracking-wider">
                Multi-Layer Client Architecture Diagram
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* View Layer */}
                <div className="border border-white/10 dark:border-white/5 bg-white/20 dark:bg-brand-darkgray/20 rounded-xl p-5 text-center space-y-3">
                  <div className="inline-flex p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal dark:text-brand-cream">1. Presentation View Layer</h4>
                  <p className="text-xxs text-gray-400 font-medium">React SPA interfaces, responsive Tailwind dashboards, customized layout charts, and interactive workspace widgets.</p>
                </div>

                {/* Controller Logic Layer */}
                <div className="border border-brand-gold/30 bg-brand-gold/5 rounded-xl p-5 text-center space-y-3">
                  <div className="inline-flex p-2 bg-brand-gold/15 text-brand-gold rounded-lg">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold">2. Workspace Logic Controllers</h4>
                  <p className="text-xxs text-gray-400 font-medium">React Router context gates, role permission access nodes, mathematical price calculators, and real-time state hooks.</p>
                </div>

                {/* Storage Persistence Layer */}
                <div className="border border-white/10 dark:border-white/5 bg-white/20 dark:bg-brand-darkgray/20 rounded-xl p-5 text-center space-y-3">
                  <div className="inline-flex p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <Database className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal dark:text-brand-cream">3. Local Data Persistence Layer</h4>
                  <p className="text-xxs text-gray-400 font-medium">Local Storage session keys, seeding databases, activity records, client CRM tables, and offline quotation historical entries.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-brand-charcoal dark:text-brand-cream text-center uppercase tracking-wider">
                Functional Estimate Workflow Blueprint
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 max-w-4xl mx-auto">
                <div className="bg-gray-100 dark:bg-brand-darkgray/40 border border-gray-200 dark:border-white/5 px-4 py-3 rounded-lg text-center w-full md:w-48">
                  <span className="text-xxs uppercase tracking-wider font-extrabold text-brand-gold">1. CRM Enquiry</span>
                  <p className="text-xxs text-gray-400">Capture customer parameters and area measurements</p>
                </div>
                <ChevronRight className="hidden md:block h-5 w-5 text-brand-gold animate-bounce-horizontal" />
                
                <div className="bg-gray-100 dark:bg-brand-darkgray/40 border border-gray-200 dark:border-white/5 px-4 py-3 rounded-lg text-center w-full md:w-48">
                  <span className="text-xxs uppercase tracking-wider font-extrabold text-brand-gold">2. Design Costing</span>
                  <p className="text-xxs text-gray-400">Select material grades and furniture units</p>
                </div>
                <ChevronRight className="hidden md:block h-5 w-5 text-brand-gold animate-bounce-horizontal" />

                <div className="bg-brand-gold/10 border border-brand-gold/40 px-4 py-3 rounded-lg text-center w-full md:w-48">
                  <span className="text-xxs uppercase tracking-wider font-extrabold text-brand-gold">3. Proposal Approval</span>
                  <p className="text-xxs text-gray-400">Generate print estimate and client reviews</p>
                </div>
                <ChevronRight className="hidden md:block h-5 w-5 text-brand-gold animate-bounce-horizontal" />

                <div className="bg-gray-100 dark:bg-brand-darkgray/40 border border-gray-200 dark:border-white/5 px-4 py-3 rounded-lg text-center w-full md:w-48">
                  <span className="text-xxs uppercase tracking-wider font-extrabold text-brand-gold">4. Handover & Invoicing</span>
                  <p className="text-xxs text-gray-400">Deploy Kanban stages and record payments</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module Gallery Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wider text-brand-bronze dark:text-brand-gold">
            System Modules Gallery
          </h2>
          <p className="text-xs text-gray-400 font-medium">Click on any module during the Guided Tour to open its workspace controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="glass-card p-6 rounded-2xl border border-white/10 dark:border-white/5 flex flex-col space-y-4 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-3 bg-gradient-to-br ${m.color} rounded-xl self-start`}>
                  <Icon className={`h-6 w-6 ${m.accent}`} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-brand-charcoal dark:text-brand-cream">{m.name}</h4>
                  <p className="text-xxs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team, Outcomes, and Future Scope Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Team Information */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold">Internship Team</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-brand-gold/15 border border-brand-gold/20 rounded-full flex items-center justify-center font-display font-bold text-brand-bronze dark:text-brand-gold">
                QA
              </div>
              <div>
                <p className="text-xs font-bold text-brand-charcoal dark:text-brand-cream">Quality Assurance</p>
                <p className="text-xxs text-gray-400">Verification & Integration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-brand-gold/15 border border-brand-gold/20 rounded-full flex items-center justify-center font-display font-bold text-brand-bronze dark:text-brand-gold">
                FE
              </div>
              <div>
                <p className="text-xs font-bold text-brand-charcoal dark:text-brand-cream">Frontend Developer</p>
                <p className="text-xxs text-gray-400">UI/UX & Page Transitions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Outcomes */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold">Project Outcomes</h3>
          <ul className="space-y-2 text-xxs font-semibold text-gray-500 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Reduced proposal calculation time by 90%.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Standardized design markup fees automatically.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Zero-loss local persistent session backup.</span>
            </li>
          </ul>
        </div>

        {/* Future Scope */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 dark:border-white/5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-gold">Future Scope</h3>
          <ul className="space-y-2 text-xxs font-semibold text-gray-500 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <Smartphone className="h-3.5 w-3.5 text-brand-gold shrink-0" />
              <span>Cross-platform iOS/Android layouts.</span>
            </li>
            <li className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-brand-gold shrink-0" />
              <span>CAD file rendering & auto component calculations.</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-brand-gold shrink-0" />
              <span>Direct vendor quotation message integrations.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
