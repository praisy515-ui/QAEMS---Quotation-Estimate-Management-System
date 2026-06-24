import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { quotationService } from "../services/quotationService";
import { storage } from "../utils/storage";
import { Printer, ArrowLeft, Edit3, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";

export default function EstimatePreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const settings = quotationService.getSettings();
  const [logo, setLogo] = useState(() => storage.get("qaems_logo") || "");

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

  const quoteId = searchParams.get("id");

  useEffect(() => {
    const loadQuote = async () => {
      try {
        let selectedQuote = null;
        if (quoteId) {
          selectedQuote = await quotationService.getQuotationById(quoteId);
        } else {
          // Grab the latest quote as default fallback
          const quotes = await quotationService.getQuotations();
          if (quotes.length > 0) {
            selectedQuote = quotes[quotes.length - 1];
          }
        }
        setQuote(selectedQuote);
      } catch (err) {
        console.error("Failed to load estimate preview:", err);
      }
    };
    loadQuote();
  }, [quoteId]);

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
        <ShieldAlert className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-bold font-display text-brand-bronze dark:text-brand-gold">No Estimate Loaded</h2>
        <p className="text-xs text-gray-400 max-w-xs">Please generate a new quotation or view one from the history database.</p>
        <Link to="/new-quotation" className="glass-btn-primary text-xs">
          Generate Estimate
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getActiveFurniture = () => {
    if (!quote.furnitureOptions) return [];
    return Object.keys(quote.furnitureOptions).filter((key) => quote.furnitureOptions[key]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header controls (hidden on Print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-white/10 no-print">
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            Estimate Proposal Preview
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Review the final contract proposal layout. You can print or download this as a PDF.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/quotation-history?editId=${quote.id}`}
            className="flex items-center gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-600 dark:text-gray-300 focus:outline-none transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handlePrint}
            className="glass-btn-primary flex items-center justify-center gap-1.5 text-xs shadow-md"
            id="estimate-preview-print-btn"
          >
            <Printer className="h-4 w-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice Proposal Sheet */}
      <div className="bg-white text-black p-8 sm:p-12 rounded-2xl border shadow-lg max-w-4xl mx-auto dark:bg-white print-card animate-scale-up">
        {/* Brand Header */}
        <div className="flex justify-between items-start border-b-2 border-brand-gold/20 pb-6">
          <div className="flex gap-4 items-start">
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-16 object-contain rounded-lg border border-gray-150 p-1 shrink-0 bg-white"
              />
            )}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-[#A4865C] tracking-tight uppercase">
                Glory Simon Interiors
              </h2>
              <p className="text-xxs text-[#A4865C] font-bold italic select-none">
                "Designing Spaces, Building Dreams."
              </p>
              <div className="text-xxs text-gray-400 space-y-0.5 pt-2">
                <p>{settings.companyAddress}</p>
                <p>Email: {settings.companyEmail} | Phone: {settings.companyPhone}</p>
                <p className="text-[#A4865C] font-semibold">GSTIN: 27GSTIN8892A1Z3</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold font-display text-[#A4865C] tracking-wide uppercase">
              Estimate Proposal
            </h3>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              No: <span className="text-black font-bold">{quote.id}</span>
            </p>
            <p className="text-xxs text-gray-400 font-medium">Date: {quote.date}</p>
          </div>
        </div>

        {/* Customer & Project metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b dark:border-gray-200">
          <div className="space-y-1.5">
            <h4 className="text-xxs uppercase tracking-wider text-gray-400 font-bold">Client Information</h4>
            <div className="text-xs text-gray-700 space-y-1">
              <p className="font-bold text-sm text-black">{quote.clientName}</p>
              <p>Phone: {quote.phone}</p>
              <p>Email: {quote.email}</p>
              {quote.address && <p>Site Address: {quote.address}</p>}
            </div>
          </div>
          <div className="space-y-1.5 md:text-right">
            <h4 className="text-xxs uppercase tracking-wider text-gray-400 font-bold">Project Details</h4>
            <div className="text-xs text-gray-700 space-y-1">
              <p className="font-semibold">Project Type: {quote.projectType}</p>
              <p>Site Location: {quote.projectLocation}</p>
              <p>Room Config: {quote.numRooms}x {quote.roomType}</p>
              <p>Estimated Area: {quote.area} Sq Ft</p>
            </div>
          </div>
        </div>

        {/* Deliverables & Configurations */}
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-xxs uppercase tracking-wider text-gray-400 font-bold">Scope of Work</h4>
            <p className="text-xs text-gray-700 leading-relaxed italic bg-brand-cream/25 p-3 rounded-lg border border-gray-100">
              "{quote.scopeOfWork || "General interior design drafting and furniture installation according to layout."}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-xxs uppercase tracking-wider text-gray-400 font-bold">Material Quality</h4>
              <div className="text-xs space-y-1 text-gray-700">
                <p className="font-bold text-black">{quote.materialQuality} Tier</p>
                <p className="text-xxs text-gray-400">{quote.materialNotes || "Standard finishing materials select."}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xxs uppercase tracking-wider text-gray-400 font-bold">Furniture Selection</h4>
              <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
                {getActiveFurniture().length > 0 ? (
                  getActiveFurniture().map((f) => (
                    <li key={f} className="capitalize">
                      {f.replace(/([A-Z])/g, " $1")}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No furniture selected</li>
                )}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-xxs uppercase tracking-wider text-gray-400 font-bold">Lighting & Automation</h4>
              <p className="text-xs text-gray-700 font-semibold">{quote.lightingType} Lighting Setup</p>
            </div>
          </div>
        </div>

        {/* Pricing Tables */}
        <div className="border-t-2 border-gray-100 pt-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-gray-500 font-bold">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700 font-medium">
              {quote.costBreakdown?.roomCost > 0 && (
                <tr>
                  <td className="py-2.5">Structure & Layout Framing ({quote.projectType})</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.roomCost.toLocaleString()}</td>
                </tr>
              )}
              {quote.costBreakdown?.materialCost > 0 && (
                <tr>
                  <td className="py-2.5">Material Supply & Finishes ({quote.materialQuality} Tier)</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.materialCost.toLocaleString()}</td>
                </tr>
              )}
              {quote.costBreakdown?.furnitureCost > 0 && (
                <tr>
                  <td className="py-2.5">Custom Furniture & Cabinetry Fabrications</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.furnitureCost.toLocaleString()}</td>
                </tr>
              )}
              {quote.costBreakdown?.lightingCost > 0 && (
                <tr>
                  <td className="py-2.5">Electrical Fittings & Lighting Nodes ({quote.lightingType})</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.lightingCost.toLocaleString()}</td>
                </tr>
              )}
              {quote.costBreakdown?.labourCost > 0 && (
                <tr>
                  <td className="py-2.5">On-site Artisan Labour charges</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.labourCost.toLocaleString()}</td>
                </tr>
              )}
              {quote.costBreakdown?.installationCharges > 0 && (
                <tr>
                  <td className="py-2.5">Delivery & Handling Fees</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.installationCharges.toLocaleString()}</td>
                </tr>
              )}
              {quote.costBreakdown?.otherCharges > 0 && (
                <tr>
                  <td className="py-2.5">Other Miscellaneous Fees</td>
                  <td className="py-2.5 text-right">{settings.currencySymbol}{quote.costBreakdown.otherCharges.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-6 border-t">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal:</span>
              <span>{settings.currencySymbol}{quote.costBreakdown?.subtotal.toLocaleString()}</span>
            </div>
            {quote.costBreakdown?.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({quote.discountPercentage}%):</span>
                <span>-{settings.currencySymbol}{quote.costBreakdown.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500 font-medium">
              <span>GST/Tax ({quote.costBreakdown?.taxPercentage}%):</span>
              <span>+{settings.currencySymbol}{quote.costBreakdown?.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-black font-bold text-sm bg-brand-cream/35 p-3 rounded-lg border-t-2">
              <span>Total Estimate:</span>
              <span>{settings.currencySymbol}{quote.costBreakdown?.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Terms, Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 mt-10 border-t border-dashed border-gray-250 text-xxs text-gray-500">
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-black">Project Inclusions</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>Plywood structures lined with high-gloss laminates.</li>
              <li>Telescopic drawer runners and standard hinges.</li>
              <li>Site cleaning and waste clearance post fabrication.</li>
              <li>1-year warranty on material alignment defects.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-black">Project Exclusions</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>Any major structural modification (masonry wall demolition).</li>
              <li>Sourcing of consumer electronics or kitchen chimneys.</li>
              <li>Water piping plumbing mutations behind countertops.</li>
            </ul>
          </div>
          <div className="md:col-span-2 space-y-2 pt-2 border-t border-gray-100">
            <h5 className="font-bold uppercase tracking-wider text-black">Terms and Conditions</h5>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Estimates are valid for 30 days from proposal date.</li>
              <li>Payment Milestone: 50% mobilization advance, 40% on carcass layout fabrication, 10% post finishing.</li>
              <li>Timeline extensions may apply in case of client-directed blueprint alterations.</li>
            </ol>
          </div>
        </div>

        {/* Client Sign-off Footer */}
        <div className="flex justify-between items-end pt-12 mt-12 border-t-2 border-gray-100 text-xxs text-gray-400">
          <div className="flex flex-col items-center">
            <div className="w-32 border-b border-gray-300 h-8"></div>
            <span className="mt-1">Prepared by Glory Simon Interiors</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 border-b border-gray-300 h-8"></div>
            <span className="mt-1">Accepted Client Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
}
