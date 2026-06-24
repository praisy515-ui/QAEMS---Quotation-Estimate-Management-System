import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import { TableSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import {
  Kanban,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  AlertCircle,
  Eye,
  Search,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Approvals() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { key: "Draft", title: "Draft", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
    { key: "Pending", title: "Under Review", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    { key: "Approved", title: "Approved", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { key: "Rejected", title: "Rejected", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
    { key: "Completed", title: "Completed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" }
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    
    const fetchQuotes = async () => {
      try {
        const data = await quotationService.getQuotations();
        if (active) {
          setQuotes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load quotations:", err);
        if (active) {
          setError("Failed to connect to quotation service API endpoint.");
          setQuotes([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchQuotes();
    }, 550);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const loadQuotes = async () => {
    try {
      setError(null);
      const data = await quotationService.getQuotations();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Reload failed:", err);
      setError("Reload failed. Please verify API server connectivity.");
      setQuotes([]);
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e, quoteId) => {
    e.dataTransfer.setData("quoteId", quoteId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const quoteId = e.dataTransfer.getData("quoteId");
    if (!quoteId) return;

    const quote = quotes.find((q) => q.id === quoteId);
    if (quote && quote.status !== targetStatus) {
      updateQuoteStatus(quoteId, targetStatus);
    }
  };

  const updateQuoteStatus = async (quoteId, nextStatus) => {
    const quote = Array.isArray(quotes) ? quotes.find((q) => q.id === quoteId) : null;
    if (!quote) return;

    const updated = { ...quote, status: nextStatus };
    try {
      await quotationService.updateQuotation(quoteId, updated);
      await loadQuotes();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to save updated status to API backend.");
    }
  };

  // Mobile navigation backup
  const handleShiftLeft = (quoteId, currentStatus) => {
    const idx = columns.findIndex((c) => c.key === currentStatus);
    if (idx > 0) {
      updateQuoteStatus(quoteId, columns[idx - 1].key);
    }
  };

  const handleShiftRight = (quoteId, currentStatus) => {
    const idx = columns.findIndex((c) => c.key === currentStatus);
    if (idx < columns.length - 1) {
      updateQuoteStatus(quoteId, columns[idx + 1].key);
    }
  };

  const settings = quotationService.getSettings();
  const currencySymbol = settings.currencySymbol || "$";

  // Filter quotes based on search query
  const filteredQuotes = Array.isArray(quotes) ? quotes.filter(
    (q) =>
      (q.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.projectLocation || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const getPriority = (grandTotal) => {
    if (grandTotal >= 50000) return { label: "High", color: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" };
    if (grandTotal >= 15000) return { label: "Medium", color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" };
    return { label: "Low", color: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400" };
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-64 bg-slate-150 dark:bg-slate-800/80 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-96 bg-slate-150 dark:bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in select-none p-6">
        <div className="flex items-center gap-3 border-b pb-4 dark:border-slate-800">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-lg">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Quotation Approval Pipeline
            </h1>
            <p className="text-xs text-rose-500 font-semibold">
              Connection error or service failure detected.
            </p>
          </div>
        </div>
        <EmptyState
          icon={AlertCircle}
          title="Service Connection Error"
          description={error}
          actionText="Retry Connection"
          onAction={loadQuotes}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Quotation Approval Pipeline
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag and drop estimates to shift status, lock approvals, and trigger payments.
            </p>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border dark:border-slate-800 shadow-sm max-w-md relative">
        <div className="absolute left-7 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search client name or quotation ID..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/50"
        />
      </div>

      {/* Kanban Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] select-none">
        {columns.map((col, colIdx) => {
          const colQuotes = filteredQuotes.filter(
            (q) => q.status === col.key || (col.key === "Pending" && q.status === "Under Review")
          );

          return (
            <div
              key={col.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
              className="flex flex-col w-72 shrink-0 bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl p-4 space-y-4"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800/80">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500">
                  {colQuotes.length}
                </span>
              </div>

              {/* Draggable Cards Stack */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {colQuotes.map((quote) => {
                  const prio = getPriority(quote.costBreakdown?.grandTotal || 0);

                  return (
                    <div
                      key={quote.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, quote.id)}
                      className="p-4 rounded-2xl border bg-white dark:bg-slate-950 border-slate-150 dark:border-slate-800/80 shadow-sm hover:border-blue-500/40 transition-colors cursor-grab active:cursor-grabbing space-y-3.5 group relative"
                    >
                      {/* Quote ID & Priority */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-blue-500">{quote.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded-md ${prio.color}`}>
                          {prio.label}
                        </span>
                      </div>

                      {/* Client Name & Project Type */}
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                          {quote.clientName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {quote.projectType} • {quote.roomType}
                        </p>
                      </div>

                      {/* Footer Details: Date, Area, Cost */}
                      <div className="flex justify-between items-center border-t pt-2.5 dark:border-slate-800/60 text-[10px] text-slate-400 font-semibold">
                        <span>{quote.area} sq ft</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {currencySymbol}
                          {(quote.costBreakdown?.grandTotal || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Hover action overlay icons */}
                      <div className="absolute top-2.5 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/quotation-details?id=${quote.id}`}
                          className="p-1 hover:bg-slate-50 dark:hover:bg-slate-850 rounded text-slate-400 hover:text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      {/* Mobile arrows shift layout */}
                      <div className="flex justify-between items-center border-t border-dashed pt-2.5 mt-1 lg:hidden">
                        <button
                          onClick={() => handleShiftLeft(quote.id, quote.status)}
                          disabled={colIdx === 0}
                          className="p-1 border rounded hover:bg-slate-50 dark:border-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move Left"
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400">Shift</span>
                        <button
                          onClick={() => handleShiftRight(quote.id, quote.status)}
                          disabled={colIdx === columns.length - 1}
                          className="p-1 border rounded hover:bg-slate-50 dark:border-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move Right"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {colQuotes.length === 0 && (
                  <div className="py-14 border border-dashed rounded-2xl text-center text-[10px] text-slate-400 border-slate-200/80 dark:border-slate-800/40">
                    No items in {col.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
