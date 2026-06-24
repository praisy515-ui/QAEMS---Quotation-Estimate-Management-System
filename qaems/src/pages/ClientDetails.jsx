import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import {
  Users,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Edit3,
  Trash2,
  FileText,
  Calendar,
  Check,
  Briefcase
} from "lucide-react";

export default function ClientDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const clientId = searchParams.get("id");

  // Form edit states
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
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    if (!clientId) return;
    try {
      const allClients = await quotationService.getClients();
      const found = allClients.find((c) => c.id === clientId);
      if (found) {
        setClient(found);
        setFormData({
          name: found.name,
          phone: found.phone,
          email: found.email,
          address: found.address || "",
          location: found.location || "",
          stage: found.status || found.stage || "Lead"
        });
        // Fetch associated quotes
        const allQuotes = await quotationService.getQuotations();
        const clientQuotes = allQuotes.filter(
          (q) => q.clientName.toLowerCase() === found.name.toLowerCase()
        );
        setQuotes(clientQuotes);
      }
    } catch (err) {
      console.error("Load client details failed:", err);
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name) errs.name = "Name is required";
    if (!formData.phone) errs.phone = "Phone is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.location) errs.location = "Location is required";

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      await quotationService.updateClient(clientId, formData);
      await loadClientData();
      setFormModalOpen(false);
    } catch (err) {
      console.error("Update client failed:", err);
      alert("Failed to update client profile.");
    }
  };

  const handleDeleteClient = async () => {
    if (window.confirm(`Are you sure you want to delete client ${client.name}? All CRM timeline entries will be lost.`)) {
      try {
        await quotationService.deleteClient(clientId);
        navigate("/customers");
      } catch (err) {
        console.error("Delete client failed:", err);
        alert("Failed to delete client profile.");
      }
    }
  };

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Users className="h-12 w-12 text-slate-300" />
        <h2 className="text-sm font-bold text-slate-700">Client Profile Not Found</h2>
        <Link to="/customers" className="glass-btn-secondary text-xs">
          Return to CRM List
        </Link>
      </div>
    );
  }

  const settings = quotationService.getSettings();
  const currencySymbol = settings.currencySymbol || "$";

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Back Button */}
      <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/customers")}
            className="p-2 border rounded-xl hover:bg-slate-50 dark:border-slate-800 text-slate-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {client.name} CRM Profile
            </h1>
            <p className="text-[10px] text-slate-400">
              ID: {client.id} | Registered on {client.createdAt || "N/A"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFormModalOpen(true)}
            className="flex items-center gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={handleDeleteClient}
            className="flex items-center gap-1 text-xs px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-600 focus:outline-none transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Metadata card info */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-col items-center text-center pb-4 border-b dark:border-slate-800/60">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center font-bold text-blue-500 font-display text-xl mb-3">
              {client.name.charAt(0)}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{client.name}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{client.location}</p>
            <div className="mt-3">
              <StatusBadge status={client.stage} />
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-350">
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="truncate">{client.email}</span>
            </div>
            {client.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <span>{client.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Column: Proposals & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Proposals List Card */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b pb-2 dark:border-slate-800/60 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-slate-400" />
              Generated Estimates & Proposals
            </h3>

            <div className="space-y-3">
              {quotes.length > 0 ? (
                quotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => navigate(`/quotation-details?id=${q.id}`)}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/10 flex items-center justify-between hover:border-blue-500/30 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-500 text-xs">{q.id}</span>
                        <StatusBadge status={q.status} />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {q.numRooms}x {q.roomType} | Area: {q.area} sq ft | Material: {q.materialQuality}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {currencySymbol}
                        {(q.costBreakdown?.grandTotal || 0).toLocaleString()}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{q.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border border-dashed rounded-xl text-slate-400 text-xxs">
                  No quotation files issued for this customer.
                </div>
              )}
            </div>
          </div>

          {/* CRM Timeline card history */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b pb-2 dark:border-slate-800/60 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-slate-400" />
              CRM Interaction Timeline Log
            </h3>

            <div className="relative border-l pl-4 border-slate-200 dark:border-slate-800 ml-2 space-y-5 pt-1 text-xs text-slate-600 dark:text-slate-400">
              {client.timeline && client.timeline.length > 0 ? (
                client.timeline.map((log, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-950" />
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{log.title}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{log.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{log.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-2 text-slate-400 text-xxs italic">
                  No interaction timeline logged for this client profile.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Client Modal Form */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Modify Client Profile"
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
