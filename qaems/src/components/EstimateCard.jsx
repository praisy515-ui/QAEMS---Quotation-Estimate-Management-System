import React from "react";
import { DollarSign, Tag, Percent } from "lucide-react";

export default function EstimateCard({ breakdown, currencySymbol = "$" }) {
  if (!breakdown) return null;

  const {
    roomCost = 0,
    materialCost = 0,
    furnitureCost = 0,
    lightingCost = 0,
    labourCost = 0,
    installationCharges = 0,
    otherCharges = 0,
    subtotal = 0,
    discountAmount = 0,
    taxAmount = 0,
    grandTotal = 0,
    taxPercentage = 18,
    discountPercentage = 0
  } = breakdown;

  const costItems = [
    { label: "Base Structure Cost", value: roomCost },
    { label: "Material Quality Cost", value: materialCost },
    { label: "Furniture Selections", value: furnitureCost },
    { label: "Lighting Configuration", value: lightingCost },
    { label: "Labour Cost", value: labourCost },
    { label: "Installation Charges", value: installationCharges },
    { label: "Additional Charges", value: otherCharges },
  ];

  return (
    <div className="glass-panel border-brand-gold/30 rounded-2xl p-6 shadow-lg flex flex-col space-y-5 animate-scale-up">
      <div className="border-b pb-3 dark:border-white/10">
        <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold">
          Estimate Summary
        </h3>
        <p className="text-xxs uppercase tracking-wider text-gray-400 mt-0.5">
          Real-time pricing breakdown
        </p>
      </div>

      {/* Itemized list */}
      <div className="space-y-2.5 text-xs">
        {costItems.map(
          (item, idx) =>
            item.value > 0 && (
              <div key={idx} className="flex justify-between text-brand-charcoal/70 dark:text-brand-cream/70">
                <span>{item.label}</span>
                <span className="font-semibold">
                  {currencySymbol}
                  {item.value.toLocaleString()}
                </span>
              </div>
            )
        )}
      </div>

      <div className="border-t pt-4 space-y-2.5 dark:border-white/10 text-xs">
        {/* Subtotal */}
        <div className="flex justify-between font-medium text-brand-charcoal dark:text-brand-cream">
          <span>Subtotal</span>
          <span>
            {currencySymbol}
            {subtotal.toLocaleString()}
          </span>
        </div>

        {/* Discount */}
        {discountPercentage > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              Discount ({discountPercentage}%)
            </span>
            <span className="font-semibold">
              -{currencySymbol}
              {discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Tax */}
        <div className="flex justify-between text-brand-charcoal/70 dark:text-brand-cream/70">
          <span className="flex items-center gap-1">
            <Percent className="h-3.5 w-3.5 text-gray-400" />
            Tax/GST ({taxPercentage}%)
          </span>
          <span className="font-semibold">
            +{currencySymbol}
            {taxAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t border-dashed pt-4 dark:border-white/15">
        <div className="flex justify-between items-center bg-brand-gold/10 dark:bg-brand-gold/15 p-4 rounded-xl border border-brand-gold/20">
          <span className="text-sm font-bold font-display text-brand-bronze dark:text-brand-gold">
            Grand Total
          </span>
          <span className="text-xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            {currencySymbol}
            {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
