import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
  Settings as SettingsIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit
} from "lucide-react";

export default function QuotationDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const settings = quotationService.getSettings();

  const id = searchParams.get("id");

  useEffect(() => {
    const loadQuote = async () => {
      if (id) {
        try {
          const q = await quotationService.getQuotationById(id);
          setQuote(q);
          if (q) setStatus(q.status);
        } catch (err) {
          console.error("Failed to load quotation details:", err);
        }
      }
    };
    loadQuote();
  }, [id]);

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
        <AlertCircle className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-bold font-display text-brand-bronze dark:text-brand-gold">Quotation Not Found</h2>
        <p className="text-xs text-gray-400 max-w-xs">The requested quotation does not exist or has been deleted.</p>
        <Link to="/quotation-history" className="glass-btn-secondary text-xs">
          Back to History
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    setSavingStatus(true);
    setStatus(newStatus);
    try {
      const updated = await quotationService.updateQuotationStatus(quote.id, newStatus);
      setQuote(updated);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const getFurnitureItems = () => {
    if (!quote.furnitureOptions) return [];
    return Object.keys(quote.furnitureOptions).filter((k) => quote.furnitureOptions[k]);
  };

  // Timeline activities mapped from real DB statusHistory
  const timelineActivities = [
    ...(quote.statusHistory || []).map((h) => ({
      title: `Status Shift: ${h.status}`,
      date: new Date(h.timestamp).toISOString().split('T')[0],
      desc: `Workflow transitioned state to ${h.status}.`,
      status: "done"
    })).reverse()
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/quotation-history")}
            className="p-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-500 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
              Quotation details: {quote.id}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              View scope parameters, timeline records, and pricing charts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status selection widget */}
          <div className="flex items-center gap-2 border dark:border-white/10 rounded-lg px-3 py-1.5 bg-white dark:bg-brand-darkgray/30 text-xs">
            <span className="font-semibold text-gray-400">Status:</span>
            <select
              value={status}
              disabled={savingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="font-bold text-brand-bronze dark:text-brand-gold bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
            {savingStatus && (
              <div className="h-3 w-3 animate-spin rounded-full border border-brand-gold/30 border-t-brand-bronze" />
            )}
          </div>

          <Link
            to={`/quotation-history?editId=${quote.id}`}
            className="flex items-center gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-600 dark:text-gray-300 focus:outline-none transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          
          <Link
            to={`/estimate-preview?id=${quote.id}`}
            className="glass-btn-primary flex items-center justify-center gap-1.5 text-xs shadow-md"
          >
            <Eye className="h-4 w-4" />
            <span>Preview Proposal</span>
          </Link>
        </div>
      </div>

      {/* Detail grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scope & Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Card */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              Client Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Client Name</p>
                <p className="font-bold text-sm text-brand-charcoal dark:text-brand-cream">{quote.clientName}</p>
              </div>
              <div>
                <p className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Phone Number</p>
                <p className="font-semibold">{quote.phone}</p>
              </div>
              <div>
                <p className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Email Address</p>
                <p className="font-semibold">{quote.email}</p>
              </div>
              <div>
                <p className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Project Location</p>
                <p className="font-semibold">{quote.projectLocation}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xxs uppercase tracking-wider text-gray-400 font-semibold">Postal Address</p>
                <p className="font-medium text-gray-600 dark:text-gray-300">{quote.address || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Scope Card */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              Project Deliverables & Details
            </h3>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 dark:bg-brand-darkgray/10 p-3 rounded-xl">
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase">Project Type</span>
                  <span className="font-bold">{quote.projectType}</span>
                </div>
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase">Room Type</span>
                  <span className="font-bold">{quote.roomType}</span>
                </div>
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase">Estimated Area</span>
                  <span className="font-bold">{quote.area} Sq Ft</span>
                </div>
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase">Room Count</span>
                  <span className="font-bold">{quote.numRooms} Room(s)</span>
                </div>
              </div>

              <div>
                <span className="text-xxs text-gray-400 font-semibold block uppercase mb-1">Scope description</span>
                <p className="text-xs text-brand-charcoal/80 dark:text-brand-cream/80 leading-relaxed bg-brand-cream/20 p-3 rounded-xl border dark:border-white/5">
                  {quote.scopeOfWork || "No detailed scope specified."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase mb-1">Material Quality Tier</span>
                  <span className="font-bold text-brand-bronze dark:text-brand-gold">{quote.materialQuality} Grade</span>
                  <p className="text-xxs text-gray-400 mt-0.5">{quote.materialNotes || "Standard finishing."}</p>
                </div>
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase mb-1">Furniture options</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {getFurnitureItems().length > 0 ? (
                      getFurnitureItems().map((f) => (
                        <li key={f} className="capitalize text-xxs font-medium">{f.replace(/([A-Z])/g, " $1")}</li>
                      ))
                    ) : (
                      <li className="text-xxs text-gray-400">None selected</li>
                    )}
                  </ul>
                </div>
                <div>
                  <span className="text-xxs text-gray-400 font-semibold block uppercase mb-1">Lighting Setup</span>
                  <span className="font-semibold">{quote.lightingType} Lighting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Timeline */}
        <div className="space-y-6">
          {/* Cost breakdown summary card */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              Quotation Total
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Base Cost:</span>
                <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown?.roomCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Material Cost:</span>
                <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown?.materialCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Furniture Cost:</span>
                <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown?.furnitureCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lighting Cost:</span>
                <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown?.lightingCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Labour charges:</span>
                <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown?.labourCost || 0).toLocaleString()}</span>
              </div>
              {(quote.costBreakdown?.installationCharges || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Installation:</span>
                  <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown.installationCharges || 0).toLocaleString()}</span>
                </div>
              )}
              {(quote.costBreakdown?.otherCharges || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Other charges:</span>
                  <span className="font-semibold">{settings.currencySymbol}{(quote.costBreakdown.otherCharges || 0).toLocaleString()}</span>
                </div>
              )}

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal:</span>
                  <span>{settings.currencySymbol}{(quote.costBreakdown?.subtotal || 0).toLocaleString()}</span>
                </div>
                {(quote.costBreakdown?.discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({quote.discountPercentage}%):</span>
                    <span>-{settings.currencySymbol}{(quote.costBreakdown.discountAmount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 font-semibold">
                  <span>GST/Tax ({quote.costBreakdown?.taxPercentage}%):</span>
                  <span>+{settings.currencySymbol}{(quote.costBreakdown?.taxAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brand-bronze dark:text-brand-gold font-bold text-sm bg-brand-gold/10 p-3 rounded-lg border">
                  <span>Grand Total:</span>
                  <span>{settings.currencySymbol}{(quote.costBreakdown?.grandTotal || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              Activity Timeline
            </h3>
            
            <div className="relative border-l pl-4 border-gray-250 dark:border-white/10 ml-2 space-y-6 text-xs">
              {timelineActivities.map((act, idx) => (
                <div key={idx} className="relative">
                  {/* Bubble node */}
                  <span className="absolute -left-[21px] top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-brand-bronze dark:bg-brand-gold ring-4 ring-white dark:ring-brand-charcoal" />
                  
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-charcoal dark:text-brand-cream">{act.title}</span>
                      <span className="text-xxs text-gray-400 font-semibold">{act.date}</span>
                    </div>
                    <p className="text-xxs text-gray-500 dark:text-gray-400">{act.desc}</p>
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
