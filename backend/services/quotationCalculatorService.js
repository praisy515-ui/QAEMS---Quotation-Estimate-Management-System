const ROOM_RATES = {
  "Living Room": 120,
  "Bedroom": 100,
  "Kitchen": 150,
  "Bathroom": 130,
  "Office": 140,
  "Office Space": 140,
  "Dining Room": 120
};

const MATERIAL_MULTIPLIERS = {
  "Basic": 1.0,
  "Standard": 1.25,
  "Premium": 1.5,
  "Luxury": 2.0
};

const FURNITURE_PRICING = {
  "Sofa": 25000,
  "TV Unit": 18000,
  "Dining Table": 22000,
  "Modular Wardrobe": 35000,
  "Workstation": 15000,
  // Helper mappings for frontend compatibility
  "modularKitchen": 35000,
  "wardrobe": 35000,
  "tvUnit": 18000,
  "studyTable": 15000,
  "falseCeiling": 10000,
  "storageUnits": 12000
};

const LIGHTING_PRICING = {
  "Basic": 5000,
  "Basic Lighting": 5000,
  "Decorative": 12000,
  "Decorative Lighting": 12000,
  "Smart": 25005,
  "Smart Lighting": 25000
};

const calculate = (params) => {
  const roomType = params.roomType || "Living Room";
  const area = Number(params.area) || 0;
  const materialLevel = params.materialLevel || params.materialQuality || "Standard";
  let furnitureItems = params.furnitureItems || [];
  const lightingType = params.lightingType || "Basic";
  let labourCost = Number(params.labourCost) || 0;
  const tax = params.tax !== undefined && params.tax !== "" && params.tax !== null ? Number(params.tax) : (Number(params.taxPercentage) || 0);
  const discount = params.discount !== undefined && params.discount !== "" && params.discount !== null ? Number(params.discount) : (Number(params.discountPercentage) || 0);

  // If furnitureItems is not an array but an object (e.g. from frontend form), map it
  if (params.furnitureOptions && !Array.isArray(furnitureItems) && typeof params.furnitureOptions === 'object') {
    furnitureItems = [];
    if (params.furnitureOptions.sofa) furnitureItems.push("Sofa");
    if (params.furnitureOptions.tvUnit) furnitureItems.push("TV Unit");
    if (params.furnitureOptions.diningTable) furnitureItems.push("Dining Table");
    if (params.furnitureOptions.wardrobe) furnitureItems.push("Modular Wardrobe");
    if (params.furnitureOptions.studyTable) furnitureItems.push("Workstation");
    if (params.furnitureOptions.modularKitchen) furnitureItems.push("Modular Wardrobe"); // mapped
    if (params.furnitureOptions.falseCeiling) furnitureItems.push("falseCeiling");
    if (params.furnitureOptions.storageUnits) furnitureItems.push("storageUnits");
  } else if (Array.isArray(params.furnitureOptions)) {
    furnitureItems = params.furnitureOptions;
  }

  // 1. Room Rate
  const roomRate = ROOM_RATES[roomType] || ROOM_RATES["Living Room"];

  // 2. Material Multiplier
  const materialMultiplier = MATERIAL_MULTIPLIERS[materialLevel] || MATERIAL_MULTIPLIERS["Standard"];

  // 3. Material Cost = area * roomRate * materialMultiplier
  const materialCost = Math.round(area * roomRate * materialMultiplier);

  // 4. Furniture Cost = sum(selected furniture)
  let furnitureCost = 0;
  const normalizedFurniture = [];
  furnitureItems.forEach(item => {
    // If it's a key or name, lookup rate
    const rate = FURNITURE_PRICING[item] || 0;
    furnitureCost += rate;
    normalizedFurniture.push(item);
  });

  // 5. Lighting Cost
  const lightingCost = LIGHTING_PRICING[lightingType] || LIGHTING_PRICING["Basic"];

  // 6. Labour Cost = labourCostPerSqFt * area
  const finalLabourCost = Math.round(labourCost * area);

  // 7. Subtotal
  const subtotal = materialCost + furnitureCost + lightingCost + finalLabourCost;

  // 8. Tax Amount
  const taxAmount = Math.round(subtotal * (tax / 100));

  // 9. Discount Amount
  const discountAmount = Math.round(subtotal * (discount / 100));

  // 10. Grand Total
  const grandTotal = subtotal + taxAmount - discountAmount;

  return {
    materialCost,
    furnitureCost,
    lightingCost,
    labourCost: finalLabourCost,
    subtotal,
    taxAmount,
    discountAmount,
    tax: taxAmount,
    discount: discountAmount,
    grandTotal
  };
};

module.exports = {
  calculate,
  ROOM_RATES,
  MATERIAL_MULTIPLIERS,
  FURNITURE_PRICING,
  LIGHTING_PRICING
};
