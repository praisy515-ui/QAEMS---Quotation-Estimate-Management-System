import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import { TableSkeleton } from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { validateRequired, validatePhone } from "../utils/validations";
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronRight, PlusCircle, X, ShieldAlert } from "lucide-react";

export default function SiteVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    date: "",
    time: "10:00 AM",
    location: "",
    designer: "Sarah Jenkins",
    notes: ""
  });

  useEffect(() => {
    setLoading(true);
    loadVisits().finally(() => {
      setLoading(false);
    });
  }, []);

  const loadVisits = async () => {
    try {
      const list = await quotationService.getSiteVisits();
      setVisits(list);
    } catch (err) {
      console.error("Load site visits failed:", err);
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};
    const nameErr = validateRequired(formData.clientName, "Client Name");
    const phoneErr = validatePhone(formData.phone);
    const dateErr = validateRequired(formData.date, "Date");
    const locErr = validateRequired(formData.location, "Location");

    if (nameErr) errs.clientName = nameErr;
    if (phoneErr) errs.phone = phoneErr;
    if (dateErr) errs.date = dateErr;
    if (locErr) errs.location = locErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const allClients = await quotationService.getClients();
      let matchedClient = allClients.find(c => c.name.toLowerCase() === formData.clientName.toLowerCase());
      
      if (!matchedClient) {
        matchedClient = await quotationService.createClient({
          name: formData.clientName,
          phone: formData.phone,
          email: `${formData.clientName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          address: formData.location,
          projectType: "Residential",
          status: "Audit"
        });
      }

      await quotationService.createSiteVisit({
        clientId: matchedClient.id,
        clientName: formData.clientName,
        phone: formData.phone,
        visitDate: new Date(formData.date).toISOString(),
        address: formData.location,
        assignedDesigner: formData.designer,
        notes: formData.notes
      });
      
      await loadVisits();
      setFormData({
        clientName: "",
        phone: "",
        date: "",
        time: "10:00 AM",
        location: "",
        designer: "Sarah Jenkins",
        notes: ""
      });
      setFormOpen(false);
    } catch (err) {
      console.error("Create visit failed:", err);
      alert("Failed to schedule site visit.");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Scheduled" ? "Completed" : "Scheduled";
    try {
      await quotationService.updateSiteVisitStatus(id, nextStatus);
      await loadVisits();
    } catch (err) {
      console.error("Toggle visit status failed:", err);
      alert("Failed to toggle status.");
    }
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TableSkeleton rows={5} cols={4} />
          </div>
          <div>
            <TableSkeleton rows={3} cols={2} />
          </div>
        </div>
      </div>
    );
  }

  // Generate calendar days for June 2026
  const daysInJune = 30;
  const calendarDays = [];
  
  for (let i = 1; i <= daysInJune; i++) {
    const dateStr = `2026-06-${String(i).padStart(2, "0")}`;
    const dayVisits = visits.filter((v) => v.date === dateStr);
    calendarDays.push({ dayNum: i, dateStr, visits: dayVisits });
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Site Visits Scheduler
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Track spatial audits, measurements, and consultations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="glass-btn-primary flex items-center justify-center gap-1.5 text-xs shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          Book Site Visit
        </button>
      </div>

      {/* Main layout: Calendar vs Schedule list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid Section */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
          <div className="flex justify-between items-center border-b pb-3 dark:border-white/10">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold">
              June 2026 Calendar
            </h3>
            <span className="text-xxs font-semibold uppercase tracking-wider text-gray-400">
              Interactive View
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400">
            {weekDays.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              const hasVisits = cell.visits.length > 0;
              const isScheduled = cell.visits.some((v) => v.status === "Scheduled");
              
              return (
                <div
                  key={idx}
                  className={`h-16 border rounded-lg p-1.5 flex flex-col justify-between transition-all ${
                    hasVisits
                      ? isScheduled
                        ? "bg-amber-500/10 border-amber-300 dark:border-amber-800/40"
                        : "bg-emerald-500/10 border-emerald-300 dark:border-emerald-800/40"
                      : "bg-white/40 border-gray-150 dark:border-white/5 dark:bg-brand-darkgray/10"
                  }`}
                >
                  <span className="text-xxs font-bold text-gray-500">{cell.dayNum}</span>
                  {hasVisits && (
                    <div className="flex gap-0.5 flex-wrap">
                      {cell.visits.map((v) => (
                        <span
                          key={v.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            v.status === "Scheduled" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          title={`${v.clientName} - ${v.time}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule Cards Deck */}
        <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4 flex flex-col h-[500px]">
          <div className="border-b pb-3 dark:border-white/10">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold">
              Upcoming Schedule
            </h3>
            <p className="text-xxs text-gray-400 mt-0.5">Click badges to toggle complete status</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {visits.length > 0 ? (
              visits.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl border bg-white/40 dark:bg-brand-darkgray/15 dark:border-white/5 space-y-2 relative group hover:border-brand-gold/40 transition-colors animate-scale-up"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-brand-charcoal dark:text-brand-cream">
                        {v.clientName}
                      </span>
                      <span className="text-xxs text-gray-400">{v.phone}</span>
                    </div>
                    <button
                      onClick={() => handleStatusToggle(v.id, v.status)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <StatusBadge status={v.status} />
                    </button>
                  </div>

                  <div className="space-y-1 text-xxs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>
                        {v.date} | {v.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate" title={v.location}>
                        {v.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span>Designer: {v.designer}</span>
                    </div>
                  </div>

                  {v.notes && (
                    <p className="text-xxs text-gray-400 italic bg-brand-cream/35 p-2 rounded border dark:border-white/5 dark:bg-brand-darkgray/35">
                      "{v.notes}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                icon={CalendarIcon}
                title="No site audits scheduled"
                description="Click below to register site details, dimensions scans, and designers."
                actionText="Schedule Site Audit"
                onAction={() => setFormOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-0" onClick={() => setFormOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-brand-charcoal border dark:border-white/10 p-6 flex flex-col gap-4 z-10 glass-panel animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 dark:border-white/10">
              <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold">
                Schedule Site Audit
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-150 focus:outline-none cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Client Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  className="glass-input text-xs"
                  placeholder="Client full name"
                />
                {errors.clientName && <span className="text-xs text-red-500">{errors.clientName}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="glass-input text-xs"
                    placeholder="e.g. 555-0199"
                  />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Designer Assigned</label>
                  <select
                    value={formData.designer}
                    onChange={(e) => handleInputChange("designer", e.target.value)}
                    className="glass-input text-xs cursor-pointer"
                  >
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                    <option value="Glory Simon">Glory Simon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="glass-input text-xs cursor-pointer"
                  />
                  {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="glass-input text-xs"
                    placeholder="e.g. 10:30 AM"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Site Location Address *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="glass-input text-xs"
                  placeholder="e.g. 89 Broadway St, Manhattan"
                />
                {errors.location && <span className="text-xs text-red-500">{errors.location}</span>}
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Audit Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="glass-input text-xs resize-none"
                  placeholder="Special instructions, space constraints, measurements..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4 mt-2 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="glass-btn-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-btn-primary text-xs cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}