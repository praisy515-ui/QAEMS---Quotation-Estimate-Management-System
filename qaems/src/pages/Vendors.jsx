import React, { useEffect, useState } from "react";
import { quotationService } from "../services/quotationService";
import StatusBadge from "../components/StatusBadge";
import { Truck, Star, Phone, Mail, Award, CheckCircle } from "lucide-react";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState("All");

  useEffect(() => {
    const list = quotationService.getVendors();
    setVendors(list);
  }, []);

  const specialties = [
    "All",
    "Cabinetry",
    "Lighting",
    "Fabrics",
    "Stone",
    "Paint"
  ];

  // Helper matching filter text
  const matchesFilter = (vendor) => {
    if (specialtyFilter === "All") return true;
    const specialtyText = vendor.specialty.toLowerCase();
    const filterText = specialtyFilter.toLowerCase();
    if (filterText === "cabinetry" && specialtyText.includes("wood")) return true;
    if (filterText === "lighting" && specialtyText.includes("light")) return true;
    if (filterText === "fabrics" && specialtyText.includes("fabric")) return true;
    if (filterText === "stone" && specialtyText.includes("stone")) return true;
    if (filterText === "stone" && specialtyText.includes("marble")) return true;
    if (filterText === "paint" && specialtyText.includes("paint")) return true;
    return false;
  };

  const filteredVendors = vendors.filter(matchesFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            Vendor Directory
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Manage fabricators, suppliers, lighting technicians, and painters.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-150 dark:border-white/5">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSpecialtyFilter(spec)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none ${
              specialtyFilter === spec
                ? "bg-brand-bronze text-white dark:bg-brand-gold dark:text-brand-charcoal shadow-sm"
                : "bg-white/40 hover:bg-white text-gray-500 border dark:bg-brand-darkgray/10 dark:border-white/5"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((v) => (
          <div
            key={v.id}
            className="glass-card rounded-2xl p-6 border dark:border-white/10 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xxs font-bold text-gray-400">{v.id}</span>
                <StatusBadge status={v.status} />
              </div>
              <h3 className="text-sm font-bold font-display text-brand-charcoal dark:text-brand-cream">
                {v.name}
              </h3>
              <span className="inline-block text-xxs font-medium bg-brand-gold/10 text-brand-bronze dark:text-brand-gold px-2 py-0.5 rounded-md">
                {v.specialty}
              </span>
            </div>

            <div className="space-y-2 text-xs border-t pt-3 dark:border-white/5">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>{v.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate">{v.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Award className="h-3.5 w-3.5 text-gray-400" />
                <span>Active Assignments: <span className="font-bold text-brand-bronze dark:text-brand-gold">{v.activeProjects}</span></span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-3 dark:border-white/5">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold">{v.rating}</span>
              </div>
              
              <button
                onClick={() => alert(`Dialing Vendor ${v.name}: ${v.phone}`)}
                className="text-xxs font-bold text-brand-bronze hover:underline dark:text-brand-gold uppercase tracking-wider"
              >
                Contact Vendor
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}