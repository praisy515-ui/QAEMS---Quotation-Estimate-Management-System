import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { quotationService } from "../services/quotationService";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import QuoteForm from "../components/QuoteForm";
import { TableSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { Eye, Edit3, Trash2, FileDown, History, PlusCircle, ArrowLeft } from "lucide-react";

export default function QuotationHistory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const settings = quotationService.getSettings();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check URL parameters for edit view
  const editId = searchParams.get("editId");

  useEffect(() => {
    setLoading(true);
    loadQuotations().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadQuotations = async () => {
    try {
      const list = await quotationService.getQuotations();
      setQuotes(list);
    } catch (err) {
      console.error("Failed to load quotations:", err);
    }
  };

  const handleDelete = async (id, clientName) => {
    if (window.confirm(`Are you sure you want to delete quotation ${id} for ${clientName}?`)) {
      try {
        await quotationService.deleteQuotation(id);
        await loadQuotations();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete quotation.");
      }
    }
  };

  const handleEditSave = async (formData) => {
    if (editId) {
      try {
        await quotationService.updateQuotation(editId, formData);
        setSearchParams({}); // Clear editId
        await loadQuotations();
      } catch (err) {
        console.error("Edit failed:", err);
        alert("Failed to update quotation.");
      }
    }
  };

  // Filter and Search logic
  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.projectLocation.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || q.status === statusFilter;
    const matchesType = typeFilter === "All" || q.projectType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const columns = [
    {
      header: "Quotation ID",
      key: "id",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-brand-bronze dark:text-brand-gold">{row.id}</span>
      )
    },
    {
      header: "Client Name",
      key: "clientName",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-brand-charcoal dark:text-brand-cream">{row.clientName}</span>
          <span className="text-xxs text-gray-400">{row.email}</span>
        </div>
      )
    },
    {
      header: "Project Details",
      key: "projectType",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.projectType}</span>
          <span className="text-xxs text-gray-400">{row.projectLocation}</span>
        </div>
      )
    },
    {
      header: "Created Date",
      key: "date",
      sortable: true,
      render: (row) => <span className="text-xs text-gray-500">{row.date}</span>
    },
    {
      header: "Amount",
      key: "costBreakdown.grandTotal",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-brand-charcoal dark:text-brand-cream">
          {settings.currencySymbol}
          {(row.costBreakdown?.grandTotal || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/quotation-details?id=${row.id}`}
            className="p-1 text-gray-400 hover:text-brand-bronze dark:hover:text-brand-gold rounded transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          
          <button
            onClick={() => setSearchParams({ editId: row.id })}
            className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors focus:outline-none cursor-pointer"
            title="Edit quotation"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          
          <Link
            to={`/estimate-preview?id=${row.id}`}
            className="p-1 text-gray-400 hover:text-emerald-500 rounded transition-colors"
            title="Preview estimate proposal"
          >
            <FileDown className="h-4 w-4" />
          </Link>
 
          <button
            onClick={() => handleDelete(row.id, row.clientName)}
            className="p-1 text-gray-400 hover:text-rose-500 rounded transition-colors focus:outline-none cursor-pointer"
            title="Delete record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-white/10">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-250 dark:bg-white/10 rounded"></div>
            <div className="h-3.5 w-64 bg-gray-200 dark:bg-white/15 rounded"></div>
          </div>
        </div>
        <TableSkeleton rows={6} cols={7} />
      </div>
    );
  }

  // If in EDIT view mode
  if (editId) {
    const editQuote = quotes.find((q) => q.id === editId);
    return (
      <div className="space-y-6 animate-fade-in select-none">
        <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
          <button
            onClick={() => setSearchParams({})}
            className="p-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Modify Quotation: {editId}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Updating estimate parameters for client {editQuote?.clientName}.
            </p>
          </div>
        </div>
        
        {editQuote && (
          <QuoteForm
            initialData={editQuote}
            onSave={handleEditSave}
            onCancel={() => setSearchParams({})}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Quotation History
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Search, filter, edit or export generated quotations and contract documents.
            </p>
          </div>
        </div>
        
        <Link
          to="/new-quotation"
          className="glass-btn-primary flex items-center justify-center gap-1.5 text-xs shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Quote
        </Link>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between border dark:border-white/5 shadow-sm">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="ID, name or location..." />
        
        <div className="flex items-center gap-4 flex-wrap">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "Approved", label: "Approved" },
              { value: "Pending", label: "Pending" },
              { value: "Rejected", label: "Rejected" }
            ]}
            label="Status"
          />

          <FilterDropdown
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "All", label: "All Project Types" },
              { value: "Residential", label: "Residential" },
              { value: "Commercial", label: "Commercial" }
            ]}
            label="Type"
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredQuotes.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredQuotes}
          emptyMessage="No quotations match your filters."
          pageSize={8}
          onRowClick={(row) => navigate(`/quotation-details?id=${row.id}`)}
        />
      ) : (
        <EmptyState
          icon={History}
          title="No quotations found"
          description="Create client quotations, modular kitchen estimations, or residential proposals to get started."
          actionText="Create New Quote"
          onAction={() => navigate("/new-quotation")}
        />
      )}
    </div>
  );
}
