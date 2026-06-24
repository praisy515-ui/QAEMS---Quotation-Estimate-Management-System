import React, { useState } from "react";
import { ESTIMATE_RATES } from "../utils/calculations";
import { Layers, Scale, Check } from "lucide-react";

export default function MaterialSelection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Cabinetry", "Surfaces", "Finishes", "Ceilings"];

  // Mock Materials Data
  const materials = [
    {
      id: "MAT-001",
      name: "High-Density Fiberboard (HDF)",
      category: "Cabinetry",
      tier: "Basic",
      price: "$15 / sq ft",
      durability: "Moderate",
      rating: "★★★☆☆",
      desc: "Laminated boards suitable for dry zones. Low moisture resistance, cost-efficient.",
      details: ["Thickness: 18mm", "Warranty: 1 Year", "Finishing: Solid Gloss Laminate"]
    },
    {
      id: "MAT-002",
      name: "Boiling Water Resistant (BWR) Plywood",
      category: "Cabinetry",
      tier: "Standard",
      price: "$30 / sq ft",
      durability: "High",
      rating: "★★★★☆",
      desc: "Waterproof chemical-treated core. Suitable for kitchens, bathrooms, and wardrobes.",
      details: ["Thickness: 19mm", "Warranty: 5 Years", "Finishing: Matte/Textured Laminate"]
    },
    {
      id: "MAT-003",
      name: "Teak Wood / Solid Veneer",
      category: "Cabinetry",
      tier: "Premium",
      price: "$55 / sq ft",
      durability: "Excellent",
      rating: "★★★★★",
      desc: "Luxury solid core with natural veneer polish. Elite wood texture, high prestige.",
      details: ["Thickness: 20mm + Polish", "Warranty: 10 Years", "Finishing: PU Polish / Matte Veneer"]
    },
    {
      id: "MAT-004",
      name: "Laminate Sheet Counters",
      category: "Surfaces",
      tier: "Basic",
      price: "$10 / sq ft",
      durability: "Low",
      rating: "★★☆☆☆",
      desc: "MDF core with laminated surface. Susceptible to scratch and heat marks.",
      details: ["Heat Resist: Up to 80°C", "Scratch Resist: Low", "Stain Resist: Moderate"]
    },
    {
      id: "MAT-005",
      name: "Granite Stone Countertop",
      category: "Surfaces",
      tier: "Standard",
      price: "$25 / sq ft",
      durability: "High",
      rating: "★★★★☆",
      desc: "Natural granite stone. High scratch resistance, heatproof, requires sealing.",
      details: ["Thickness: 20mm Polish", "Heat Resist: High", "Stain Resist: High"]
    },
    {
      id: "MAT-006",
      name: "Premium Quartz Stone Countertop",
      category: "Surfaces",
      tier: "Premium",
      price: "$65 / sq ft",
      durability: "Excellent",
      rating: "★★★★★",
      desc: "Engineered quartz. Non-porous, stain proof, heatproof. Absolute premium.",
      details: ["Thickness: 15mm Double Bevel", "Heat Resist: Very High", "Stain Resist: Impervious"]
    },
    {
      id: "MAT-007",
      name: "Standard Gypsum Ceiling",
      category: "Ceilings",
      tier: "Standard",
      price: "$6 / sq ft",
      durability: "Moderate",
      rating: "★★★☆☆",
      desc: "Clean gypsum board layouts. Fits standard LED housings and ribbons.",
      details: ["Moisture Resist: Low", "Load capacity: Up to 5kg", "Thermal Resist: Moderate"]
    },
    {
      id: "MAT-008",
      name: "Acoustic / Wooden Paneled Ceiling",
      category: "Ceilings",
      tier: "Premium",
      price: "$14 / sq ft",
      durability: "High",
      rating: "★★★★★",
      desc: "Teak slatted wooden ceilings with acoustic dampening. Ideal for home theaters & executive rooms.",
      details: ["Moisture Resist: High", "Acoustic absorption: Excellent", "Thermal Resist: High"]
    },
    {
      id: "MAT-009",
      name: "Bespoke Solid Mahogany & Walnut Cabinetry",
      category: "Cabinetry",
      tier: "Luxury",
      price: "$90 / sq ft",
      durability: "Lifetime Guarantee",
      rating: "★★★★★",
      desc: "Top-grade solid mahogany and walnut carcass with gold-leaf accents, soft-close magnetic dampers, and customized velvet-lined storage drawer segments.",
      details: ["Thickness: 22mm + Multi-coat Lacquer", "Warranty: Lifetime", "Finishing: French Polish / Gold Trim"]
    },
    {
      id: "MAT-010",
      name: "Imported Italian Statuario Marble Countertop",
      category: "Surfaces",
      tier: "Luxury",
      price: "$120 / sq ft",
      durability: "Excellent",
      rating: "★★★★★",
      desc: "Premium natural Statuario Italian marble slab. Exquisite gold and gray veining, high-durability sealant coating.",
      details: ["Thickness: 25mm Full Bullnose", "Heat Resist: Outstanding", "Stain Resist: Sealer Coated"]
    }
  ];

  // Compare Tool States
  const [compareMat1, setCompareMat1] = useState(materials[0].id);
  const [compareMat2, setCompareMat2] = useState(materials[1].id);

  const mat1 = materials.find((m) => m.id === compareMat1) || materials[0];
  const mat2 = materials.find((m) => m.id === compareMat2) || materials[1];

  const filteredMaterials =
    activeCategory === "All"
      ? materials
      : materials.filter((m) => m.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            Material Catalog
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Browse finishes, wood quality tiers, countertops, and evaluate pricing standards.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-150 dark:border-white/5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none ${
              activeCategory === cat
                ? "bg-brand-bronze text-white dark:bg-brand-gold dark:text-brand-charcoal shadow-sm"
                : "bg-white/40 hover:bg-white text-gray-500 border dark:bg-brand-darkgray/10 dark:border-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="glass-card rounded-2xl p-6 border dark:border-white/10 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xxs font-bold text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {mat.tier} Quality
                </span>
                <span className="text-xs font-bold text-brand-bronze dark:text-brand-gold">
                  {mat.price}
                </span>
              </div>
              <h3 className="text-sm font-bold font-display text-brand-charcoal dark:text-brand-cream pt-1">
                {mat.name}
              </h3>
              <p className="text-xxs text-gray-400 font-medium">{mat.category}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{mat.desc}</p>
            </div>

            {/* Bullet Details */}
            <div className="border-t pt-3 dark:border-white/5 text-xxs space-y-1 text-gray-400">
              {mat.details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-brand-gold" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Material Comparison Widget */}
      <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-6">
        <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10 flex items-center gap-2">
          <Scale className="h-5 w-5 text-gray-400" />
          Material Side-by-Side Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* selectors */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-400">Select First Material</label>
            <select
              value={compareMat1}
              onChange={(e) => setCompareMat1(e.target.value)}
              className="glass-input text-xs cursor-pointer"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tier})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-400">Select Second Material</label>
            <select
              value={compareMat2}
              onChange={(e) => setCompareMat2(e.target.value)}
              className="glass-input text-xs cursor-pointer"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.tier})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Result Table Grid */}
        <div className="grid grid-cols-2 gap-4 border dark:border-white/10 rounded-xl p-4 bg-white/40 dark:bg-brand-darkgray/10 text-xs">
          {/* Mat 1 detail panel */}
          <div className="space-y-3 pr-4 border-r dark:border-white/5">
            <h4 className="font-bold text-sm text-brand-bronze dark:text-brand-gold">{mat1.name}</h4>
            <div className="space-y-1 bg-gray-50/50 dark:bg-brand-darkgray/25 p-2.5 rounded-lg space-y-2">
              <p>
                <span className="text-xxs text-gray-400 block">Category</span>
                <span className="font-semibold">{mat1.category}</span>
              </p>
              <p>
                <span className="text-xxs text-gray-400 block">Cost Standard</span>
                <span className="font-semibold text-brand-gold">{mat1.price}</span>
              </p>
              <p>
                <span className="text-xxs text-gray-400 block">Durability Rating</span>
                <span className="font-semibold">{mat1.durability} ({mat1.rating})</span>
              </p>
              <p>
                <span className="text-xxs text-gray-400 block">Specifications</span>
                <span className="font-medium text-gray-500">{mat1.desc}</span>
              </p>
            </div>
          </div>

          {/* Mat 2 detail panel */}
          <div className="space-y-3 pl-2">
            <h4 className="font-bold text-sm text-brand-bronze dark:text-brand-gold">{mat2.name}</h4>
            <div className="space-y-1 bg-gray-50/50 dark:bg-brand-darkgray/25 p-2.5 rounded-lg space-y-2">
              <p>
                <span className="text-xxs text-gray-400 block">Category</span>
                <span className="font-semibold">{mat2.category}</span>
              </p>
              <p>
                <span className="text-xxs text-gray-400 block">Cost Standard</span>
                <span className="font-semibold text-brand-gold">{mat2.price}</span>
              </p>
              <p>
                <span className="text-xxs text-gray-400 block">Durability Rating</span>
                <span className="font-semibold">{mat2.durability} ({mat2.rating})</span>
              </p>
              <p>
                <span className="text-xxs text-gray-400 block">Specifications</span>
                <span className="font-medium text-gray-500">{mat2.desc}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
