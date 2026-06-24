import React from "react";
import { useNavigate } from "react-router-dom";
import { quotationService } from "../services/quotationService";
import QuoteForm from "../components/QuoteForm";
import { FilePlus } from "lucide-react";

export default function NewQuotation() {
  const navigate = useNavigate();

  const handleSaveQuotation = async (formData) => {
    try {
      // Save quotation using the service
      const savedQuote = await quotationService.createQuotation(formData);
      if (savedQuote && savedQuote.id) {
        // Redirect to estimate preview for this newly created quote
        navigate(`/estimate-preview?id=${savedQuote.id}`);
      } else {
        navigate("/quotation-history");
      }
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Failed to save quotation. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/quotation-history");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <FilePlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            New Quotation Builder
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Fill in the multi-step form to calculate pricing, draft scopes, and generate estimates.
          </p>
        </div>
      </div>

      {/* Quote Form Wizard */}
      <QuoteForm onSave={handleSaveQuotation} onCancel={handleCancel} />
    </div>
  );
}
