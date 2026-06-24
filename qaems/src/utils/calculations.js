/**
 * Calculation rules for Interior Quotation & Estimate Management System (QAEMS)
 */

export const ESTIMATE_RATES = {
  projectType: {
    Residential: 12, // Base cost per sq ft
    Commercial: 18,
  },
  materialQuality: {
    Basic: 15,     // per sq ft
    Standard: 30,  // per sq ft
    Premium: 55,   // per sq ft
    Luxury: 90,    // per sq ft
  },
  furniture: {
    wardrobe: 1200,       // Flat rate per room
    modularKitchen: 3500,  // Flat rate (typically kitchen)
    tvUnit: 800,          // Flat rate
    falseCeiling: 6,      // Cost per sq ft
    studyTable: 500,      // Flat rate
    storageUnits: 900,    // Flat rate
  },
  lighting: {
    Basic: 300,        // Flat rate
    Decorative: 1200,   // Flat rate
    Smart: 2500,       // Flat rate
  }
};

/**
 * Calculates a complete cost breakdown based on quotation input data
 * @param {Object} input - Form input values
 * @param {Object} defaultSettings - System default settings (GST, Labour, etc.)
 */
export const calculateQuotation = (input, defaultSettings = {}) => {
  const area = Number(input.area) || 0;
  const numRooms = Number(input.numRooms) || 1;
  
  const projectType = input.projectType || "Residential";
  const materialQuality = input.materialQuality || "Standard";
  const lightingType = input.lightingType || "Basic";
  const furnitureOptions = input.furnitureOptions || {};

  // 1. Room Cost (Base Structure Cost)
  const baseRate = ESTIMATE_RATES.projectType[projectType] || 12;
  const roomCost = baseRate * area * numRooms;

  // 2. Material Cost
  const materialRate = ESTIMATE_RATES.materialQuality[materialQuality] || 30;
  const materialCost = materialRate * area * numRooms;

  // 3. Furniture Cost
  let furnitureCost = 0;
  if (furnitureOptions.wardrobe) furnitureCost += ESTIMATE_RATES.furniture.wardrobe * numRooms;
  if (furnitureOptions.modularKitchen) furnitureCost += ESTIMATE_RATES.furniture.modularKitchen;
  if (furnitureOptions.tvUnit) furnitureCost += ESTIMATE_RATES.furniture.tvUnit;
  if (furnitureOptions.falseCeiling) furnitureCost += ESTIMATE_RATES.furniture.falseCeiling * area * numRooms;
  if (furnitureOptions.studyTable) furnitureCost += ESTIMATE_RATES.furniture.studyTable;
  if (furnitureOptions.storageUnits) furnitureCost += ESTIMATE_RATES.furniture.storageUnits;

  // 4. Lighting Cost
  const lightingCost = ESTIMATE_RATES.lighting[lightingType] || 300;

  // 5. Labour Cost
  // Use user input labour cost per sq ft or default settings value, or fallback to 15
  const labourRate = Number(input.labourCost) !== undefined && input.labourCost !== ""
    ? Number(input.labourCost) 
    : (Number(defaultSettings.defaultLabourCharges) || 15);
  const labourCost = labourRate * area * numRooms;

  // 6. Installation Charges
  const installationCharges = Number(input.installationCharges) || 0;

  // 7. Other Charges
  const otherCharges = Number(input.otherCharges) || 0;

  // 8. Subtotal (Before Tax & Discount)
  const subtotal = roomCost + materialCost + furnitureCost + lightingCost + labourCost + installationCharges + otherCharges;

  // 9. Discount
  const discountPercentage = Number(input.discountPercentage) || 0;
  const discountAmount = subtotal * (discountPercentage / 100);

  // 10. Taxable Subtotal
  const taxableSubtotal = subtotal - discountAmount;

  // 11. Tax (GST)
  const taxPercentage = input.taxPercentage !== undefined && input.taxPercentage !== ""
    ? Number(input.taxPercentage)
    : (Number(defaultSettings.gstPercentage) || 18);
  const taxAmount = taxableSubtotal * (taxPercentage / 100);

  // 12. Grand Total
  const grandTotal = taxableSubtotal + taxAmount;

  return {
    roomCost: Math.round(roomCost),
    materialCost: Math.round(materialCost),
    furnitureCost: Math.round(furnitureCost),
    lightingCost: Math.round(lightingCost),
    labourCost: Math.round(labourCost),
    installationCharges: Math.round(installationCharges),
    otherCharges: Math.round(otherCharges),
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    taxAmount: Math.round(taxAmount),
    grandTotal: Math.round(grandTotal),
    taxPercentage,
    discountPercentage,
    labourRate
  };
};
