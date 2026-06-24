import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import { storage } from "../utils/storage";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import Modal from "../components/Modal";
import { CardSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { Receipt, DollarSign, CheckCircle2, AlertTriangle, Printer, Calendar, ArrowUpRight, ArrowLeft } from "lucide-react";

export default function Payments() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const settings = quotationService.getSettings();
  const [logo, setLogo] = useState(() => storage.get("qaems_logo") || "");

  // Selected invoice state for Details Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  useEffect(() => {
    const handleLogoChange = () => {
      setLogo(storage.get("qaems_logo") || "");
    };
    window.addEventListener("storage", handleLogoChange);
    window.addEventListener("logo_changed", handleLogoChange);
    return () => {
      window.removeEventListener("storage", handleLogoChange);
      window.removeEventListener("logo_changed", handleLogoChange);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadInvoices();
      setLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  const loadInvoices = () => {
    setInvoices(quotationService.getInvoices());
  };

  const handleUpdateStatus = async (id, newStatus) => {
    quotationService.updateInvoiceStatus(id, newStatus);
    loadInvoices();
    
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice((prev) => ({ ...prev, status: newStatus }));
    }

    try {
      await quotationService.addNotification({
        type: "system",
        title: "Invoice Status Updated",
        message: `Invoice ${id} marked as ${newStatus}.`
      });
    } catch (err) {
      console.error("Failed to add notification:", err);
    }
  };

  // Financial calculations
  const totalInvoiced = invoices.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const collectedRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const outstandingRevenue = invoices
    .filter((i) => i.status === "Pending" || i.status === "Overdue")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Filters
  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch =
      i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.quoteId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-white/10">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-250 dark:bg-white/10 rounded"></div>
            <div className="h-3.5 w-64 bg-gray-200 dark:bg-white/15 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="h-14 w-full bg-white/20 dark:bg-white/5 border border-white/25 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-white/10 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Invoices & Billing Ledger
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Monitor payments collected, dispatch invoices, and oversee outstanding customer receivables.
            </p>
          </div>
        </div>
      </div>

      {/* Revenue KPI summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        {/* Total Invoiced */}
        <div className="glass-card p-6 rounded-2xl border dark:border-white/5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xxs uppercase tracking-wider text-gray-400 font-semibold block">Total Invoiced</span>
            <span className="text-2xl font-bold font-display text-brand-charcoal dark:text-brand-cream">
              {settings.currencySymbol}
              {totalInvoiced.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-brand-gold/10 text-brand-bronze rounded-xl dark:bg-brand-gold/20 dark:text-brand-gold">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Collected */}
        <div className="glass-card p-6 rounded-2xl border dark:border-white/5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xxs uppercase tracking-wider text-gray-400 font-semibold block">Collected Payments</span>
            <span className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">
              {settings.currencySymbol}
              {collectedRevenue.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Outstanding */}
        <div className="glass-card p-6 rounded-2xl border dark:border-white/5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xxs uppercase tracking-wider text-gray-400 font-semibold block">Outstanding Receivables</span>
            <span className="text-2xl font-bold font-display text-rose-600 dark:text-rose-400">
              {settings.currencySymbol}
              {outstandingRevenue.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl dark:bg-rose-950/20 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between border dark:border-white/5 shadow-sm no-print">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="INV, quote or client name..." />
        
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "All", label: "All Statuses" },
            { value: "Paid", label: "Paid" },
            { value: "Pending", label: "Pending" },
            { value: "Overdue", label: "Overdue" }
          ]}
          label="Payment Status"
        />
      </div>

      {/* Invoices List Grid */}
      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="glass-card rounded-2xl p-6 border dark:border-white/10 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-all shadow-sm animate-scale-up"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xxs font-bold text-gray-400">{inv.id}</span>
                  <StatusBadge status={inv.status} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-brand-charcoal dark:text-brand-cream">
                    {inv.clientName}
                  </h3>
                  <span className="text-xxs text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-md font-semibold">
                    Quote: {inv.quoteId}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xxs text-gray-500 dark:text-gray-400 border-t pt-3 dark:border-white/5 font-semibold">
                <div className="flex justify-between">
                  <span>Invoiced Date:</span>
                  <span>{inv.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span className={inv.status === "Overdue" ? "text-rose-600 font-bold" : ""}>{inv.dueDate}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3 dark:border-white/5">
                <span className="text-sm font-bold font-display text-brand-bronze dark:text-brand-gold">
                  {settings.currencySymbol}
                  {inv.amount.toLocaleString()}
                </span>
                
                <button
                  onClick={() => {
                    setSelectedInvoice(inv);
                    setInvoiceModalOpen(true);
                  }}
                  className="text-xxs font-bold hover:underline flex items-center gap-0.5 text-brand-bronze dark:text-brand-gold uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  View Invoice
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-print">
          <EmptyState
            icon={Receipt}
            title="No invoices found"
            description="All billing logs or generated estimations requests will display here."
          />
        </div>
      )}

      {/* Invoice Detail & Print Modal Panel */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="GS Interiors - Invoicing Detail"
      >
        {selectedInvoice && (
          <div className="space-y-6 print-container text-black">
            {/* Invoice Print Layout Details (Standard format) */}
            <div className="border-b pb-4 flex justify-between items-start dark:border-gray-200">
              <div className="flex gap-3 items-start">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-12 w-12 object-contain rounded-lg border border-gray-150 p-1 shrink-0 bg-white"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-gold text-brand-charcoal font-bold font-display text-xl shrink-0 p-1">
                    G
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold font-display text-[#A4865C] uppercase leading-none pt-0.5">
                    Glory Simon Interiors
                  </h3>
                  <p className="text-[9px] italic text-[#A4865C] font-semibold select-none">
                    "Designing Spaces, Building Dreams."
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">{settings.companyAddress}</p>
                  <p className="text-[10px] text-gray-500">Email: {settings.companyEmail} | Phone: {settings.companyPhone}</p>
                  <p className="text-[10px] text-[#A4865C] font-semibold mt-0.5">GSTIN: 27GSTIN8892A1Z3</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Invoice</h4>
                <p className="font-bold text-sm text-black">{selectedInvoice.id}</p>
                <p className="text-[10px] text-gray-500">Date: {selectedInvoice.date}</p>
              </div>
            </div>

            {/* Client billing info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Billed To:</span>
                <p className="font-bold mt-0.5 text-black">{selectedInvoice.clientName}</p>
                <p className="text-[10px] text-gray-500">Reference Quote: {selectedInvoice.quoteId}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400">Due Date:</span>
                <p className={`font-bold mt-0.5 ${selectedInvoice.status === "Overdue" ? "text-red-600" : "text-black"}`}>
                  {selectedInvoice.dueDate}
                </p>
              </div>
            </div>

            {/* Billing table */}
            <div className="border-t border-b py-4 dark:border-gray-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-400">
                    <th className="py-1">Description</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-gray-700">
                  <tr>
                    <td className="py-2.5">
                      Interior design mobilization fee & carcass cabinetry setup advance ({selectedInvoice.quoteId})
                    </td>
                    <td className="py-2.5 text-right">
                      {settings.currencySymbol}
                      {selectedInvoice.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-2">
              <div className="w-48 text-xs font-semibold text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-black">{settings.currencySymbol}{selectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t-2 pt-2 text-black font-bold text-sm">
                  <span>Amount Due:</span>
                  <span>{settings.currencySymbol}{selectedInvoice.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Print Inclusions and Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-dashed border-gray-200 text-[10px] text-gray-500">
              <div className="space-y-1">
                <p className="font-bold text-black uppercase tracking-wider">Instructions:</p>
                <p>Please make wire transfers payable to: **Glory Simon Interiors LLC**</p>
                <p>Bank: Prestige Luxury Bank, NY | routing: 123456789 | A/C: 9876543210</p>
              </div>
              <div className="flex flex-col items-end justify-end h-16 pt-6">
                <div className="w-32 border-b border-gray-300"></div>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Authorized Sign-off</span>
              </div>
            </div>

            {/* Bank details & Status update (hidden on print) */}
            <div className="no-print space-y-4 border-t pt-4 border-dashed border-gray-250">
              <div className="bg-gray-50 p-3 rounded-lg border text-xxs space-y-1 font-semibold text-gray-500 dark:bg-brand-darkgray/10 dark:border-white/5">
                <p className="font-bold text-black dark:text-brand-gold uppercase tracking-wider">Wire Transfer Details:</p>
                <p>Bank: Prestige Luxury Bank, NY</p>
                <p>A/C Name: Glory Simon Interiors LLC</p>
                <p>Routing No: 123456789 | A/C No: 9876543210</p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-450 dark:text-gray-400">Modify Status:</span>
                  <select
                    value={selectedInvoice.status}
                    onChange={(e) => handleUpdateStatus(selectedInvoice.id, e.target.value)}
                    className="font-bold text-brand-bronze dark:text-brand-gold bg-transparent border rounded px-2 py-1 cursor-pointer focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <button
                  onClick={handlePrint}
                  className="glass-btn-primary flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider py-2 px-3 shadow-md cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
