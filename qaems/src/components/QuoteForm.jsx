import React, { useState, useEffect } from "react";
import { validateEmail, validatePhone, validateRequired, validatePositiveNumber } from "../utils/validations";
import { quotationService } from "../services/quotationService";
import EstimateCard from "./EstimateCard";
import {
  User,
  MapPin,
  Home,
  CheckSquare,
  Sparkles,
  Wrench,
  Percent,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Check
} from "lucide-react";

export default function QuoteForm({ initialData = null, onSave, onCancel }) {
  const settings = quotationService.getSettings();
  
  // Form State
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",
    projectType: "Residential",
    projectLocation: "",
    
    roomType: "Living Room",
    area: "",
    numRooms: 1,
    scopeOfWork: "",
    
    materialQuality: "Standard",
    materialNotes: "",
    
    furnitureOptions: {
      wardrobe: false,
      modularKitchen: false,
      tvUnit: false,
      falseCeiling: false,
      studyTable: false,
      storageUnits: false,
    },
    
    lightingType: "Basic",
    
    labourCost: settings.defaultLabourCharges || 15,
    installationCharges: "",
    
    taxPercentage: settings.gstPercentage || 18,
    discountPercentage: "",
    otherCharges: "",
    notes: ""
  });

  // Step state
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [breakdown, setBreakdown] = useState(null);

  // CRM client link states
  const [clientsList, setClientsList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("new");
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      setClientsLoading(true);
      setClientsError("");
      try {
        const list = await quotationService.getClients();
        setClientsList(list || []);
      } catch (err) {
        console.error("Failed to load clients in QuoteForm:", err);
        setClientsError("Failed to load clients. Please reload.");
      } finally {
        setClientsLoading(false);
      }
    };
    loadClients();
  }, []);

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    if (clientId === "new") {
      setFormData((prev) => ({
        ...prev,
        clientName: "",
        phone: "",
        email: "",
        address: "",
        projectLocation: ""
      }));
    } else {
      const client = clientsList.find((c) => c.id === clientId);
      if (client) {
        setFormData((prev) => ({
          ...prev,
          clientName: client.name,
          phone: client.phone,
          email: client.email,
          address: client.address || "",
          projectLocation: client.location || ""
        }));
      }
    }
  };

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Make sure furnitureOptions exist
        furnitureOptions: {
          wardrobe: false,
          modularKitchen: false,
          tvUnit: false,
          falseCeiling: false,
          studyTable: false,
          storageUnits: false,
          ...(initialData.furnitureOptions || {})
        }
      });
    }
  }, [initialData]);

  // Recalculate cost breakdown on form changes
  useEffect(() => {
    const areaVal = Number(formData.area);
    if (!formData.area || isNaN(areaVal) || areaVal < 1) {
      setBreakdown(null);
      return;
    }

    const triggerCalculate = async () => {
      try {
        const calc = await quotationService.calculateQuotation(formData);
        setBreakdown(calc);
      } catch (err) {
        console.error("Calculation failed:", err);
      }
    };

    const delay = setTimeout(triggerCalculate, 300);
    return () => clearTimeout(delay);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    // Clear field error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFurnitureToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      furnitureOptions: {
        ...prev.furnitureOptions,
        [key]: !prev.furnitureOptions[key]
      }
    }));
  };

  // Validate step
  const validateStep = () => {
    const stepErrors = {};
    if (step === 1) {
      const nameErr = validateRequired(formData.clientName, "Client Name");
      const phoneErr = validatePhone(formData.phone);
      const emailErr = validateEmail(formData.email);
      const locErr = validateRequired(formData.projectLocation, "Project Location");
      
      if (nameErr) stepErrors.clientName = nameErr;
      if (phoneErr) stepErrors.phone = phoneErr;
      if (emailErr) stepErrors.email = emailErr;
      if (locErr) stepErrors.projectLocation = locErr;
    } else if (step === 2) {
      const areaErr = validatePositiveNumber(formData.area, "Area");
      const roomsErr = validatePositiveNumber(formData.numRooms, "Number of Rooms");
      
      if (areaErr) stepErrors.area = areaErr;
      if (roomsErr) stepErrors.numRooms = roomsErr;
    } else if (step === 6) {
      if (formData.labourCost !== "") {
        const labErr = validatePositiveNumber(formData.labourCost, "Labour charges");
        if (labErr) stepErrors.labourCost = labErr;
      }
      if (formData.installationCharges !== "") {
        const instErr = validatePositiveNumber(formData.installationCharges, "Installation charges");
        if (instErr) stepErrors.installationCharges = instErr;
      }
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All inputs will be lost.")) {
      setFormData({
        clientName: "",
        phone: "",
        email: "",
        address: "",
        projectType: "Residential",
        projectLocation: "",
        roomType: "Living Room",
        area: "",
        numRooms: 1,
        scopeOfWork: "",
        materialQuality: "Standard",
        materialNotes: "",
        furnitureOptions: {
          wardrobe: false,
          modularKitchen: false,
          tvUnit: false,
          falseCeiling: false,
          studyTable: false,
          storageUnits: false,
        },
        lightingType: "Basic",
        labourCost: settings.defaultLabourCharges || 15,
        installationCharges: "",
        taxPercentage: settings.gstPercentage || 18,
        discountPercentage: "",
        otherCharges: "",
        notes: ""
      });
      setStep(1);
      setErrors({});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onSave(formData);
    }
  };

  // Step headers mapping
  const stepMeta = [
    { title: "Client Info", icon: User },
    { title: "Room Setup", icon: Home },
    { title: "Material", icon: Sparkles },
    { title: "Furniture", icon: CheckSquare },
    { title: "Lighting", icon: Sparkles },
    { title: "Labour", icon: Wrench },
    { title: "Additional", icon: Percent }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Form Card */}
      <div className="flex-1 glass-panel rounded-2xl p-6 shadow-md w-full border dark:border-white/10">
        {/* Multi-step progress bar */}
        <div className="mb-8 border-b pb-6 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold font-display text-brand-bronze dark:text-brand-gold">
              Step {step} of 7: {stepMeta[step - 1].title}
            </span>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              {Math.round((step / 7) * 100)}% Complete
            </span>
          </div>
          {/* Progress bar line */}
          <div className="w-full h-1.5 bg-gray-100 dark:bg-brand-darkgray rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-bronze dark:bg-brand-gold transition-all duration-300 ease-out"
              style={{ width: `${(step / 7) * 100}%` }}
            ></div>
          </div>
          {/* Step Icon bubbles */}
          <div className="flex justify-between items-center mt-6 px-2">
            {stepMeta.map((s, idx) => {
              const Icon = s.icon;
              const isPassed = idx + 1 < step;
              const isActive = idx + 1 === step;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 relative flex-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
                      isPassed
                        ? "bg-brand-bronze text-white border-brand-bronze dark:bg-brand-gold dark:text-brand-charcoal dark:border-brand-gold"
                        : isActive
                        ? "bg-white text-brand-bronze border-brand-bronze shadow-md scale-110 dark:bg-brand-darkgray dark:text-brand-gold dark:border-brand-gold"
                        : "bg-gray-50 text-gray-400 border-gray-200 dark:bg-brand-charcoal dark:border-white/10"
                    }`}
                  >
                    {isPassed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="hidden sm:inline text-xxs font-medium text-gray-400 select-none">
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps Content Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Customer Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* CRM Link Selector */}
              <div className="flex flex-col space-y-1 bg-brand-cream/40 dark:bg-brand-darkgray/25 p-3.5 rounded-xl border dark:border-white/5">
                <label className="text-xs font-semibold text-gray-500">Link to CRM Customer Profile</label>
                <select
                  value={selectedClientId}
                  disabled={clientsLoading}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="glass-input text-xs cursor-pointer focus:ring-brand-gold"
                >
                  {clientsLoading ? (
                    <option disabled>Loading clients from CRM...</option>
                  ) : clientsError ? (
                    <option disabled>{clientsError}</option>
                  ) : (
                    <>
                      <option value="new">-- Register New Customer Profile --</option>
                      {Array.isArray(clientsList) && clientsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="Enter client's full name"
                  />
                  {errors.clientName && <span className="text-xs text-red-500">{errors.clientName}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Phone Number *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. 555-0199"
                  />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="david.h@example.com"
                  />
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Project Location *</label>
                  <input
                    type="text"
                    value={formData.projectLocation}
                    onChange={(e) => handleInputChange("projectLocation", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. Brooklyn, NY"
                  />
                  {errors.projectLocation && <span className="text-xs text-red-500">{errors.projectLocation}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange("projectType", e.target.value)}
                    className="glass-input text-sm cursor-pointer"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Site Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="Full postal address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Room Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Room Type</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => handleInputChange("roomType", e.target.value)}
                    className="glass-input text-sm cursor-pointer"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Office">Office</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Bathroom">Bathroom</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Area (Square Feet) *</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. 450"
                  />
                  {errors.area && <span className="text-xs text-red-500">{errors.area}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Number of Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numRooms}
                    onChange={(e) => handleInputChange("numRooms", e.target.value)}
                    className="glass-input text-sm"
                  />
                  {errors.numRooms && <span className="text-xs text-red-500">{errors.numRooms}</span>}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Scope of Work</label>
                <textarea
                  rows="4"
                  value={formData.scopeOfWork}
                  onChange={(e) => handleInputChange("scopeOfWork", e.target.value)}
                  className="glass-input text-sm resize-none"
                  placeholder="Describe scope, style goals, layouts, etc..."
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: Material Quality */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold text-gray-500">Material Quality Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Basic Card */}
                  <label
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.materialQuality === "Basic"
                        ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                        : "border-gray-200 bg-white/50 hover:bg-white dark:border-white/10 dark:bg-brand-darkgray/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="materialQuality"
                      value="Basic"
                      checked={formData.materialQuality === "Basic"}
                      onChange={() => handleInputChange("materialQuality", "Basic")}
                      className="sr-only"
                    />
                    <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Basic Tier</span>
                    <span className="text-xxs text-gray-400 mt-1">Budget-friendly materials. High-density fiberboard, laminates, and basic handles.</span>
                  </label>

                  {/* Standard Card */}
                  <label
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.materialQuality === "Standard"
                        ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                        : "border-gray-200 bg-white/50 hover:bg-white dark:border-white/10 dark:bg-brand-darkgray/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="materialQuality"
                      value="Standard"
                      checked={formData.materialQuality === "Standard"}
                      onChange={() => handleInputChange("materialQuality", "Standard")}
                      className="sr-only"
                    />
                    <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Standard Tier</span>
                    <span className="text-xxs text-gray-400 mt-1">Excellent cost-to-performance balance. BWR plywood, high-gloss laminates, acrylic panels.</span>
                  </label>

                  {/* Premium Card */}
                  <label
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.materialQuality === "Premium"
                        ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                        : "border-gray-200 bg-white/50 hover:bg-white dark:border-white/10 dark:bg-brand-darkgray/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="materialQuality"
                      value="Premium"
                      checked={formData.materialQuality === "Premium"}
                      onChange={() => handleInputChange("materialQuality", "Premium")}
                      className="sr-only"
                    />
                    <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Premium Tier</span>
                    <span className="text-xxs text-gray-400 mt-1">Top luxury materials. Veneer panel finishes, solid teak details, and quartz surfaces.</span>
                  </label>

                  {/* Luxury Card */}
                  <label
                    className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.materialQuality === "Luxury"
                        ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                        : "border-gray-200 bg-white/50 hover:bg-white dark:border-white/10 dark:bg-brand-darkgray/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="materialQuality"
                      value="Luxury"
                      checked={formData.materialQuality === "Luxury"}
                      onChange={() => handleInputChange("materialQuality", "Luxury")}
                      className="sr-only"
                    />
                    <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Luxury Tier</span>
                    <span className="text-xxs text-gray-400 mt-1">Bespoke Italian selections. Solid walnut framing, Statuario marble, and automated fittings.</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Custom Material Notes</label>
                <textarea
                  rows="3"
                  value={formData.materialNotes}
                  onChange={(e) => handleInputChange("materialNotes", e.target.value)}
                  className="glass-input text-sm resize-none"
                  placeholder="Specify particular brand choices, wood qualities, or paint styles..."
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 4: Furniture Options */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-xs font-semibold text-gray-500">Select Furniture Deliverables</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(formData.furnitureOptions).map((key) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleFurnitureToggle(key)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      formData.furnitureOptions[key]
                        ? "border-brand-bronze bg-brand-gold/5 text-brand-bronze font-semibold dark:border-brand-gold dark:text-brand-gold"
                        : "border-gray-250 bg-white/40 hover:bg-white text-gray-500 dark:border-white/5 dark:bg-brand-darkgray/10"
                    }`}
                  >
                    <span className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center ${
                        formData.furnitureOptions[key]
                          ? "bg-brand-bronze border-brand-bronze text-white dark:bg-brand-gold dark:border-brand-gold dark:text-brand-charcoal"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.furnitureOptions[key] && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Lighting */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-xs font-semibold text-gray-500">Lighting Option</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Lighting */}
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.lightingType === "Basic"
                      ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                      : "border-gray-250 bg-white/40 hover:bg-white dark:border-white/5 dark:bg-brand-darkgray/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="lightingType"
                    value="Basic"
                    checked={formData.lightingType === "Basic"}
                    onChange={() => handleInputChange("lightingType", "Basic")}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Basic Setup</span>
                  <span className="text-xxs text-gray-400 mt-1">Concealed downlights and basic utility junction boxes.</span>
                </label>

                {/* Decorative Lighting */}
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.lightingType === "Decorative"
                      ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                      : "border-gray-250 bg-white/40 hover:bg-white dark:border-white/5 dark:bg-brand-darkgray/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="lightingType"
                    value="Decorative"
                    checked={formData.lightingType === "Decorative"}
                    onChange={() => handleInputChange("lightingType", "Decorative")}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Decorative Setup</span>
                  <span className="text-xxs text-gray-400 mt-1">Profile lighting, false ceiling cove ribbons, and chandelier hooks.</span>
                </label>

                {/* Smart Lighting */}
                <label
                  className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.lightingType === "Smart"
                      ? "border-brand-bronze bg-brand-gold/10 dark:border-brand-gold"
                      : "border-gray-250 bg-white/40 hover:bg-white dark:border-white/5 dark:bg-brand-darkgray/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="lightingType"
                    value="Smart"
                    checked={formData.lightingType === "Smart"}
                    onChange={() => handleInputChange("lightingType", "Smart")}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-brand-bronze dark:text-brand-gold">Smart Automation</span>
                  <span className="text-xxs text-gray-400 mt-1">App-controlled RGB strips, dimming nodes, and motion sensors.</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Labour */}
          {step === 6 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Labour Rate (per Sq Ft)</label>
                  <input
                    type="number"
                    value={formData.labourCost}
                    onChange={(e) => handleInputChange("labourCost", e.target.value)}
                    className="glass-input text-sm"
                    placeholder={`Defaults to ${settings.defaultLabourCharges}`}
                  />
                  {errors.labourCost && <span className="text-xs text-red-500">{errors.labourCost}</span>}
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Installation/Handling Charges ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    value={formData.installationCharges}
                    onChange={(e) => handleInputChange("installationCharges", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. 1500"
                  />
                  {errors.installationCharges && <span className="text-xs text-red-500">{errors.installationCharges}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Additional Charges */}
          {step === 7 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Tax/GST Percentage (%)</label>
                  <input
                    type="number"
                    value={formData.taxPercentage}
                    onChange={(e) => handleInputChange("taxPercentage", e.target.value)}
                    className="glass-input text-sm"
                    placeholder={`Defaults to ${settings.gstPercentage}%`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange("discountPercentage", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Other Flat Charges ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    value={formData.otherCharges}
                    onChange={(e) => handleInputChange("otherCharges", e.target.value)}
                    className="glass-input text-sm"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Quotation Notes / Terms</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="glass-input text-sm resize-none"
                  placeholder="Any final notes, special inclusion comments, or validity parameters..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Navigation controls */}
          <div className="flex items-center justify-between border-t pt-6 mt-8 dark:border-white/10">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-500 dark:text-gray-400 focus:outline-none transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-50 dark:border-white/10 dark:hover:bg-brand-darkgray text-gray-500 dark:text-gray-400 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="glass-btn-secondary flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}

              {step < 7 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="glass-btn-primary flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="glass-btn-primary flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  Save Quotation
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Estimator Display Column */}
      <div className="w-full lg:w-80 space-y-6">
        <EstimateCard breakdown={breakdown} currencySymbol={settings.currencySymbol} />
      </div>
    </div>
  );
}
