import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import { CardSkeleton, ChartSkeleton } from "../components/SkeletonLoader";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  PlusCircle,
  Activity,
  ChevronRight,
  Zap
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    setLoading(true);
    loadDashboardData().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsData, quotesData, visitsData, notificationsData] = await Promise.all([
        quotationService.getAnalytics(),
        quotationService.getQuotations(),
        quotationService.getSiteVisits(),
        quotationService.getNotifications()
      ]);
      setAnalytics(analyticsData);
      setRecentQuotes(quotesData.slice(-3).reverse());
      setUpcomingVisits(
        visitsData
          .filter((v) => v.status === "Scheduled")
          .slice(0, 3)
      );
      setRecentActivities(notificationsData.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

  const settings = quotationService.getSettings();
  const currencySymbol = settings.currencySymbol || "$";

  // Mock sparkline data
  const sparklineData = {
    clients: [{ val: 1 }, { val: 2 }, { val: 2 }, { val: 3 }, { val: 4 }, { val: analytics?.totalClients || 5 }],
    quotations: [{ val: 2 }, { val: 3 }, { val: 2 }, { val: 4 }, { val: 3 }, { val: analytics?.totalQuotations || 5 }],
    approved: [{ val: 1 }, { val: 1 }, { val: 2 }, { val: 2 }, { val: 3 }, { val: analytics?.approvedQuotations || 3 }],
    pending: [{ val: 1 }, { val: 2 }, { val: 1 }, { val: 2 }, { val: 1 }, { val: analytics?.pendingQuotations || 2 }],
    revenue: [{ val: 5000 }, { val: 12000 }, { val: 18000 }, { val: 24000 }, { val: 29000 }, { val: analytics?.revenueGenerated || 32000 }]
  };

  // Chart main dataset
  const revenueTrendData = [
    { month: "Jan", revenue: 24000, projects: 4 },
    { month: "Feb", revenue: 18000, projects: 3 },
    { month: "Mar", revenue: 35000, projects: 6 },
    { month: "Apr", revenue: 55000, projects: 8 },
    { month: "May", revenue: 48000, projects: 7 },
    { month: "Jun", revenue: analytics?.revenueGenerated ? analytics.revenueGenerated : 52000, projects: analytics?.approvedQuotations || 5 }
  ];

  const pieData = [
    { name: "Approved", value: analytics?.approvedQuotations || 3, color: "#22C55E" },
    { name: "Pending", value: analytics?.pendingQuotations || 2, color: "#F59E0B" },
    { name: "Rejected", value: analytics?.rejectedQuotations || 0, color: "#EF4444" }
  ];

  const barData = [
    { name: "Kitchen", Residential: 15000, Commercial: 0 },
    { name: "Living", Residential: 22000, Commercial: 8000 },
    { name: "Bedroom", Residential: 18000, Commercial: 0 },
    { name: "Office", Residential: 0, Commercial: 45000 },
    { name: "Bathroom", Residential: 9000, Commercial: 3000 }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-64 bg-slate-150 dark:bg-slate-800/80 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <div>
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in select-none">
      {/* Upper Welcome Header banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || "Designer"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Here's what is happening with Glory Simon Interiors projects today.
          </p>
        </div>

        {/* Quick actions panel button links */}
        <div className="flex items-center gap-3">
          <Link
            to="/new-quotation"
            className="glass-btn-primary flex items-center justify-center gap-2 text-xs shadow-sm hover:scale-[1.02] transition-transform"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Quotation</span>
          </Link>
          <Link
            to="/site-visits"
            className="glass-btn-secondary flex items-center justify-center gap-2 text-xs hover:scale-[1.02] transition-transform"
          >
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>Book Visit</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Summary Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Clients */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-32 border dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Clients</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2 z-10">
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.totalClients || 0}</span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12.4%</span>
              </div>
            </div>
            {/* Sparkline Container */}
            <div className="w-16 h-8 opacity-70 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.clients}>
                  <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={1.5} fill="rgba(59, 130, 246, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Quotations */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-32 border dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Quotations</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2 z-10">
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.totalQuotations || 0}</span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+8.2%</span>
              </div>
            </div>
            {/* Sparkline Container */}
            <div className="w-16 h-8 opacity-70 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.quotations}>
                  <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={1.5} fill="rgba(99, 102, 241, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 3: Approved Quotations */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-32 border dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Quotes</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-lg">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2 z-10">
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.approvedQuotations || 0}</span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+15.0%</span>
              </div>
            </div>
            {/* Sparkline Container */}
            <div className="w-16 h-8 opacity-70 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.approved}>
                  <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={1.5} fill="rgba(16, 185, 129, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 4: Pending Quotations */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-32 border dark:border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Quotes</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2 z-10">
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.pendingQuotations || 0}</span>
              <div className="flex items-center gap-1 text-[10px] text-rose-600 font-semibold mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-3.5%</span>
              </div>
            </div>
            {/* Sparkline Container */}
            <div className="w-16 h-8 opacity-70 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.pending}>
                  <Area type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={1.5} fill="rgba(245, 158, 11, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 5: Revenue Generated */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden h-32 border dark:border-slate-800 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue Generated</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-lg">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2 z-10">
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white truncate">
                {currencySymbol}
                {(analytics?.revenueGenerated || 0).toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+22.8%</span>
              </div>
            </div>
            {/* Sparkline Container */}
            <div className="w-16 h-8 opacity-70 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData.revenue}>
                  <Area type="monotone" dataKey="val" stroke="#f43f5e" strokeWidth={1.5} fill="rgba(244, 63, 94, 0.05)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graphics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800/60 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Revenue Pipeline & Design Trend
              </h3>
              <p className="text-[10px] text-slate-400">Monthly contract closure values.</p>
            </div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
              Jan - Jun 2026
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    borderRadius: "10px",
                    fontSize: "11px"
                  }}
                  formatter={(val) => [`${currencySymbol}${val.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quotation Status Pie chart */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800/60 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Conversion Pipeline
              </h3>
              <p className="text-[10px] text-slate-400">Distribution of quotation approvals.</p>
            </div>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    borderRadius: "10px",
                    fontSize: "11px"
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Timelines, Site visits, Recent quotations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Upcoming visits */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 space-y-4 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800/60 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Upcoming Spatial Audits
            </h3>
            <Link to="/site-visits" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5">
              <span>Schedule</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {upcomingVisits.length > 0 ? (
              upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-start gap-3 hover:border-blue-500/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{visit.clientName}</p>
                      <span className="text-[9px] text-slate-400 font-semibold shrink-0">{visit.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{visit.location}</p>
                    <p className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      Designer: {visit.designer}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 p-6">
                <Calendar className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xxs font-semibold">No audits booked</p>
                <p className="text-[10px] mt-0.5">All scheduled visits completed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Recent quotations */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 space-y-4 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800/60 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Recent Proposals
            </h3>
            <Link to="/quotation-history" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5">
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {recentQuotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => navigate(`/quotation-details?id=${quote.id}`)}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/10 flex flex-col justify-between space-y-3 hover:border-blue-500/25 transition-all shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-blue-500">{quote.id}</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{quote.clientName}</h4>
                  </div>
                  <StatusBadge status={quote.status} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-2 dark:border-slate-800/40 font-semibold">
                  <span>{quote.roomType}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">
                    {currencySymbol}
                    {(quote.costBreakdown?.grandTotal || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent activities */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 space-y-4 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800/60 shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Recent Activity Feed
            </h3>
            <div className="p-1 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg">
              <Activity className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="relative border-l pl-4 border-slate-100 dark:border-slate-800 ml-2.5 space-y-4 pt-1">
              {recentActivities.map((log) => (
                <div key={log.id} className="relative text-xxs">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-950" />
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {log.title}
                      </span>
                      <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed truncate-2-lines">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}