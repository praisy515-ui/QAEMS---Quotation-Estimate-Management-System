import React, { useState, useEffect } from "react";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import Modal from "../components/Modal";
import { CardSkeleton, TableSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import {
  Users,
  PlusCircle,
  Eye,
  Edit3,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  UserPlus,
  Check,
  Grid,
  List,
  ArrowUpDown,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [sortBy, setSortBy] = useState("name"); // name, stage, date
  const [sortOrder, setSortOrder] = useState("asc");

  // Selection for View Detail & Add/Edit
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    location: "",
    stage: "Lead"
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadData = async () => {
    try {
      const [allClients, allQuotes] = await Promise.all([
        quotationService.getClients(),
        quotationService.getQuotations()
      ]);
      setClients(allClients);
      setQuotes(allQuotes);
    } catch (err) {
      console.error("Failed to load customers data:", err);
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      location: "",
      stage: "Lead"
    });
    setFormErrors({});
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address || "",
      location: client.location || client.address || "",
      stage: client.status || client.stage || "Lead"
    });
    setFormErrors({});
    setFormModalOpen(true);
  };

  const handleOpenDetailModal = (client) => {
    setSelectedClient(client);
    setDetailModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name) errs.name = "Client Name is required";
    if (!formData.phone) errs.phone = "Phone Number is required";
    if (!formData.email) errs.email = "Email Address is required";
    if (!formData.location) errs.location = "Project Location is required";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      if (editingClient) {
        await quotationService.updateClient(editingClient.id, formData);
      } else {
        await quotationService.createClient(formData);
      }
      await loadData();
      setFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save client:", err);
      alert("Failed to save client.");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter & Sort clients
  const filteredClients = clients
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === "All" || c.stage === stageFilter;
      return matchesSearch && matchesStage;
    })
    .sort((a, b) => {
      let valA = a[sortBy] || "";
      let valB = b[sortBy] || "";
      if (sortBy === "date") {
        valA = a.createdAt || "";
        valB = b.createdAt || "";
      }
      
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const getClientQuotes = (name) => {
    return quotes.filter((q) => q.clientName.toLowerCase() === name.toLowerCase());
  };

  const settings = quotationService.getSettings();
  const currencySymbol = settings.currencySymbol || "$";

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-64 bg-slate-150 dark:bg-slate-800/80 rounded"></div>
          </div>
        </div>
        <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={5} cols={6} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Customer CRM Registry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage client records, stage logs of engagement, and historical proposals.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="glass-btn-primary flex items-center justify-center gap-2 text-xs shadow-md"
          id="crm-add-client-btn"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Control Panel: search, filter & toggle layout */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between border dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md relative">
          <div className="absolute left-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone or email..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/50"
          />
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <FilterDropdown
            value={stageFilter}
            onChange={setStageFilter}
            options={[
              { value: "All", label: "All Stages" },
              { value: "Lead", label: "Lead" },
              { value: "Audit", label: "Audit" },
              { value: "Proposal", label: "Proposal" },
              { value: "Signed", label: "Signed" },
              { value: "Completed", label: "Completed" }
            ]}
            label="Stage"
          />

          {/* Grid vs Table Toggles */}
          <div className="flex items-center border dark:border-slate-800 rounded-xl p-0.5 bg-slate-100/50 dark:bg-slate-900/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-500 shadow-sm dark:bg-slate-800"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-white text-blue-500 shadow-sm dark:bg-slate-800"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CRM Main Client Data Render */}
      {filteredClients.length > 0 ? (
        viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((c) => (
              <div
                key={c.id}
                className="glass-card rounded-2xl p-6 border dark:border-slate-800 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-all shadow-sm animate-scale-up"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400">{c.id}</span>
                    <StatusBadge status={c.stage} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {c.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{c.location}</span>
                  </div>
                </div>

                <div className="space-y-2 text-[10px] text-slate-500 dark:text-slate-400 border-t pt-3 dark:border-slate-850 font-semibold">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  {c.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t pt-3 dark:border-slate-850 text-[10px]">
                  <span className="text-slate-400">Total Quotes: <span className="font-bold text-blue-500">{getClientQuotes(c.name).length}</span></span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(c)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors focus:outline-none cursor-pointer"
                      title="Edit details"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/client-details?id=${c.id}`)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors focus:outline-none flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Portfolio</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="border rounded-2xl dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 overflow-hidden shadow-sm animate-scale-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50/70 text-slate-500 font-semibold dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => toggleSort("name")}>
                      <div className="flex items-center gap-1.5">
                        <span>Client Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Phone</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5 text-center">Stage</th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => toggleSort("date")}>
                      <div className="flex items-center gap-1.5">
                        <span>Date Created</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800 font-medium">
                  {filteredClients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center font-bold text-xxs">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-550 dark:text-slate-400">{c.email}</td>
                      <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{c.phone}</td>
                      <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">{c.location}</td>
                      <td className="px-6 py-3.5 text-center">
                        <StatusBadge status={c.stage} />
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">{c.createdAt || "N/A"}</td>
                      <td className="px-6 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            className="p-1 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Edit profile"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/client-details?id=${c.id}`)}
                            className="p-1 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="View portfolio"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <EmptyState
          icon={Users}
          title="No clients registered"
          description="Initialize customer records, logs of site meetings, and proposals."
          actionText="Register Customer"
          onAction={handleOpenAddModal}
        />
      )}

      {/* CRM Client Details Portfolio Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedClient ? `${selectedClient.name} - CRM Profile` : ""}
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-slate-800">
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center font-bold text-blue-500 font-display text-sm">
                {selectedClient.name.charAt(0)}
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">{selectedClient.name}</p>
                <p className="text-[10px] text-slate-400">Registered on {selectedClient.createdAt || "N/A"}</p>
              </div>
            </div>

            {/* Generated proposals list */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b pb-1.5 dark:border-slate-800">
                Proposals Sent
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getClientQuotes(selectedClient.name).length > 0 ? (
                  getClientQuotes(selectedClient.name).map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setDetailModalOpen(false);
                        navigate(`/quotation-details?id=${q.id}`);
                      }}
                      className="p-3 bg-white dark:bg-slate-900/25 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-500">{q.id}</span>
                        <span className="text-[10px] text-slate-400">{q.roomType} | {q.area} sq ft</span>
                      </div>
                      <span className="font-semibold text-[10px] text-slate-800 dark:text-slate-200">
                        {currencySymbol}
                        {(q.costBreakdown?.grandTotal || 0).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No proposals sent to client.</p>
                )}
              </div>
            </div>

            {/* CRM Timeline logs */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b pb-1.5 dark:border-slate-800 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                CRM Timeline History
              </h4>
              <div className="relative border-l pl-4 border-slate-200 dark:border-slate-800 ml-2 space-y-4 text-xxs text-slate-500 max-h-56 overflow-y-auto pt-1">
                {selectedClient.timeline && selectedClient.timeline.map((log, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-950" />
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{log.title}</span>
                        <span className="text-[9px] text-slate-400">{log.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{log.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Client Modal Form */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingClient ? "Modify Client Profile" : "Register Client"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500">Client Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="glass-input text-xs"
              placeholder="e.g. David Harrison"
            />
            {formErrors.name && <span className="text-xs text-red-500">{formErrors.name}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="glass-input text-xs"
                placeholder="e.g. 555-0199"
              />
              {formErrors.phone && <span className="text-xs text-red-500">{formErrors.phone}</span>}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="glass-input text-xs"
                placeholder="david.h@example.com"
              />
              {formErrors.email && <span className="text-xs text-red-500">{formErrors.email}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500">Project Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="glass-input text-xs"
                placeholder="e.g. Brooklyn"
              />
              {formErrors.location && <span className="text-xs text-red-500">{formErrors.location}</span>}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500">Conversion Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => handleInputChange("stage", e.target.value)}
                className="glass-input text-xs cursor-pointer"
              >
                <option value="Lead">Lead</option>
                <option value="Audit">Audit</option>
                <option value="Proposal">Proposal</option>
                <option value="Signed">Signed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500">Site Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="glass-input text-xs"
              placeholder="e.g. 742 Evergreen Terrace"
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-4 mt-2 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="glass-btn-secondary text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn-primary text-xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
