import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import { useTheme } from "../context/ThemeContext";
import { TableSkeleton, ChartSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { BarChart3, Download, Printer, TrendingUp, Users, Receipt, FileSpreadsheet, CheckSquare, PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function Reports() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("revenue"); // revenue, quotations, clients, approval
  const [loading, setLoading] = useState(true);

  // State lists
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    setLoading(true);
    loadReportData().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadReportData = async () => {
    try {
      const [allQuotes, allClients, allAnalytics, revReport, appReport] = await Promise.all([
        quotationService.getQuotations(),
        quotationService.getClients(),
        quotationService.getAnalytics(),
        quotationService.getRevenueReport(),
        quotationService.getApprovalReport()
      ]);
      setQuotes(allQuotes);
      setClients(allClients);
      setAnalytics(allAnalytics);
      setRevenueChartData(revReport || []);
      setStatusData(appReport || []);
    } catch (err) {
      console.error("Failed to load report data:", err);
    }
  };

  const settings = quotationService.getSettings();
  const formatCurrency = (val) => {
    return `${settings.currencySymbol}${val.toLocaleString()}`;
  };

  // CSV Export Engine
  const handleCSVExport = () => {
    let headers = [];
    let rows = [];
    let filename = "";

    if (activeTab === "revenue") {
      filename = "GS_Revenue_Report";
      headers = ["Month", "Residential Revenue ($)", "Commercial Revenue ($)", "Total Revenue ($)"];
      rows = revenueChartData.map((d) => [d.month, d.Residential, d.Commercial, d.Residential + d.Commercial]);
    } else if (activeTab === "quotations") {
      filename = "GS_Quotations_Pipeline";
      headers = ["Quote ID", "Client Name", "Project Type", "Room Type", "Area (Sq Ft)", "Grand Total ($)", "Status", "Created Date"];
      rows = quotes.map((q) => [
        q.id,
        q.clientName,
        q.projectType,
        q.roomType,
        q.area,
        q.costBreakdown?.grandTotal || 0,
        q.status,
        q.date
      ]);
    } else if (activeTab === "clients") {
      filename = "GS_Client_CRM_Report";
      headers = ["Client ID", "Client Name", "Phone", "Email", "Location", "CRM Stage", "Date Created"];
      rows = clients.map((c) => [c.id, c.name, c.phone, c.email, c.location, c.stage, c.createdAt]);
    } else if (activeTab === "approval") {
      filename = "GS_Approval_Report";
      headers = ["Quote ID", "Client Name", "Project Type", "Room Type", "Grand Total ($)", "Approval Status", "Created Date"];
      rows = quotes.map((q) => [
        q.id,
        q.clientName,
        q.projectType,
        q.roomType,
        q.costBreakdown?.grandTotal || 0,
        q.status,
        q.date
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Chart datasets are loaded dynamically from backend reporting APIs via loadReportData

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-white/10">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-250 dark:bg-white/10 rounded"></div>
            <div className="h-3.5 w-64 bg-gray-200 dark:bg-white/15 rounded"></div>
          </div>
        </div>
        <div className="h-10 w-full bg-white/20 dark:bg-white/5 border border-white/25 rounded-xl"></div>
        <ChartSkeleton />
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header (hidden on print) */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-white/10 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Reports & Auditing Centre
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              View client conversion ratios, invoice settlements, and compile exports.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-600 dark:text-gray-300 focus:outline-none transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleCSVExport}
            className="glass-btn-primary flex items-center justify-center gap-1.5 text-xs shadow-md cursor-pointer"
            id="reports-export-btn"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Module Tabs (hidden on print) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 border-b dark:border-white/5 no-print">
        {[
          { key: "revenue", name: "Revenue Report", icon: TrendingUp },
          { key: "quotations", name: "Quotation Report", icon: FileSpreadsheet },
          { key: "clients", name: "Client Report", icon: Users },
          { key: "approval", name: "Approval Report", icon: CheckSquare }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
              activeTab === tab.key
                ? "bg-brand-bronze text-white dark:bg-brand-gold dark:text-brand-charcoal shadow-sm"
                : "bg-white/40 hover:bg-white text-gray-500 border dark:bg-brand-darkgray/10 dark:border-white/5"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* active tab print title (shown on print only) */}
      <div className="hidden print-only text-center border-b pb-4 mb-6">
        <h2 className="text-xl font-bold font-display text-[#A4865C] uppercase">Glory Simon Interiors</h2>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">
          {activeTab.toUpperCase()} REPORT SUMMARY - {new Date().toISOString().split("T")[0]}
        </p>
      </div>

      {/* REPORT CONTENT VIEW */}
      {/* 1. REVENUE REPORT */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 flex flex-col justify-between">
            <h3 className="text-sm font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/5 mb-4">
              Monthly Revenue Distribution (Residential vs Commercial)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#2d2f34" : "#f1f1f1"} />
                  <XAxis dataKey="month" stroke="#888" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#888" tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1a1c1e" : "#fff",
                      borderColor: isDark ? "#2d2f34" : "#e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="Residential" fill="#C5A880" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Commercial" fill="#8E7E69" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border rounded-xl dark:border-white/10 bg-white/40 dark:bg-brand-charcoal overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-gray-50/50 text-gray-500 font-semibold dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-gray-400">
                  <th className="px-6 py-3">Month</th>
                  <th className="px-6 py-3 text-right">Residential Revenue</th>
                  <th className="px-6 py-3 text-right">Commercial Revenue</th>
                  <th className="px-6 py-3 text-right font-bold">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 font-medium">
                {revenueChartData.map((d, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-brand-darkgray/10">
                    <td className="px-6 py-3">{d.month}</td>
                    <td className="px-6 py-3 text-right">{formatCurrency(d.Residential)}</td>
                    <td className="px-6 py-3 text-right">{formatCurrency(d.Commercial)}</td>
                    <td className="px-6 py-3 text-right font-bold text-brand-bronze dark:text-brand-gold">
                      {formatCurrency(d.Residential + d.Commercial)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. QUOTATIONS REPORT */}
      {activeTab === "quotations" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 flex flex-col items-center">
            <h3 className="text-sm font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/5 w-full mb-4">
              Pipeline Status Distribution
            </h3>
            <div className="h-48 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1a1c1e" : "#fff",
                      borderColor: isDark ? "#2d2f34" : "#e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {quotes.length > 0 ? (
            <div className="border rounded-xl dark:border-white/10 bg-white/40 dark:bg-brand-charcoal overflow-hidden shadow-sm animate-scale-up">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50/50 text-gray-500 font-semibold dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-gray-400">
                    <th className="px-6 py-3">Quote ID</th>
                    <th className="px-6 py-3">Client Name</th>
                    <th className="px-6 py-3">Project Type</th>
                    <th className="px-6 py-3">Room Type</th>
                    <th className="px-6 py-3 text-right">Grand Total</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5 font-medium">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50 dark:hover:bg-brand-darkgray/10">
                      <td className="px-6 py-3 font-bold text-brand-bronze dark:text-brand-gold">{q.id}</td>
                      <td className="px-6 py-3">{q.clientName}</td>
                      <td className="px-6 py-3">{q.projectType}</td>
                      <td className="px-6 py-3">{q.roomType}</td>
                      <td className="px-6 py-3 text-right font-bold">{formatCurrency(q.costBreakdown?.grandTotal || 0)}</td>
                      <td className="px-6 py-3 text-center">
                        <StatusBadge status={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={FileSpreadsheet}
              title="No quotations data"
              description="Pipeline statistics will populate once quotations are logged."
            />
          )}
        </div>
      )}

      {/* 3. CLIENT REPORTS */}
      {activeTab === "clients" && (
        <div className="space-y-6">
          {clients.length > 0 ? (
            <div className="border rounded-xl dark:border-white/10 bg-white/40 dark:bg-brand-charcoal overflow-hidden shadow-sm animate-scale-up">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50/50 text-gray-500 font-semibold dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-gray-400">
                    <th className="px-6 py-3">Client ID</th>
                    <th className="px-6 py-3">Client Name</th>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3 text-center">CRM Stage</th>
                    <th className="px-6 py-3">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5 font-medium">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-brand-darkgray/10">
                      <td className="px-6 py-3 font-bold text-brand-bronze dark:text-brand-gold">{c.id}</td>
                      <td className="px-6 py-3 font-bold">{c.name}</td>
                      <td className="px-6 py-3">{c.email}</td>
                      <td className="px-6 py-3">{c.phone}</td>
                      <td className="px-6 py-3">{c.location}</td>
                      <td className="px-6 py-3 text-center">
                        <StatusBadge status={c.stage} />
                      </td>
                      <td className="px-6 py-3 text-gray-400">{c.createdAt || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No customer insights"
              description="Customer statistics will populate once profiles are logged in CRM."
            />
          )}
        </div>
      )}

      {/* 4. APPROVAL REPORTS */}
      {activeTab === "approval" && (
        <div className="space-y-6">
          {/* Approval status breakdown KPI blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Draft", count: quotes.filter((q) => q.status === "Draft").length, color: "border-slate-250 text-slate-700 dark:border-slate-800" },
              { label: "Under Review", count: quotes.filter((q) => q.status === "Pending" || q.status === "Under Review").length, color: "border-amber-250 text-amber-700 dark:border-amber-800" },
              { label: "Approved", count: quotes.filter((q) => q.status === "Approved").length, color: "border-emerald-250 text-emerald-700 dark:border-emerald-800" },
              { label: "Rejected", count: quotes.filter((q) => q.status === "Rejected").length, color: "border-rose-250 text-rose-700 dark:border-rose-800" },
              { label: "Completed", count: quotes.filter((q) => q.status === "Completed").length, color: "border-blue-250 text-blue-700 dark:border-blue-800" }
            ].map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-xl border bg-white/40 dark:bg-slate-900/10 text-center ${stat.color}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">{stat.label}</span>
                <span className="text-xl font-bold mt-1 block">{stat.count}</span>
              </div>
            ))}
          </div>

          {quotes.length > 0 ? (
            <div className="border rounded-xl dark:border-white/10 bg-white/40 dark:bg-brand-charcoal overflow-hidden shadow-sm animate-scale-up">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50/50 text-gray-500 font-semibold dark:border-white/10 dark:bg-brand-darkgray/30 dark:text-gray-400">
                    <th className="px-6 py-3">Quote ID</th>
                    <th className="px-6 py-3">Client Name</th>
                    <th className="px-6 py-3">Room Config</th>
                    <th className="px-6 py-3 text-right">Estimate Total</th>
                    <th className="px-6 py-3">Last Active Date</th>
                    <th className="px-6 py-3 text-center">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5 font-medium">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50 dark:hover:bg-brand-darkgray/10">
                      <td className="px-6 py-3 font-bold text-brand-bronze dark:text-brand-gold">{q.id}</td>
                      <td className="px-6 py-3 font-bold">{q.clientName}</td>
                      <td className="px-6 py-3">{q.numRooms}x {q.roomType} ({q.area} sq ft)</td>
                      <td className="px-6 py-3 text-right font-bold">{formatCurrency(q.costBreakdown?.grandTotal || 0)}</td>
                      <td className="px-6 py-3 text-gray-400">{q.date}</td>
                      <td className="px-6 py-3 text-center">
                        <StatusBadge status={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={CheckSquare}
              title="No quotation approval history"
              description="Approval tracking metrics will populate once quotations are initialized and submitted."
            />
          )}
        </div>
      )}
    </div>
  );
}