import React, { useState, useEffect } from "react";
import { quotationService } from "../services/quotationService";
import { useTheme } from "../context/ThemeContext";
import { storage } from "../utils/storage";
import { Settings as SettingsIcon, Save, CheckCircle, RefreshCcw, Upload, Image as ImageIcon } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(() => quotationService.getSettings());
  const [logo, setLogo] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load logo from storage if exists
    const savedLogo = storage.get("qaems_logo");
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  const handleInputChange = (field, val) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleCheckboxChange = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Base64 File uploader
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setLogo(base64String);
      storage.set("qaems_logo", base64String);
      window.dispatchEvent(new Event("logo_changed"));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Currency symbols map
    const symbols = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      AED: "د.إ"
    };

    const finalSettings = {
      ...settings,
      currencySymbol: symbols[settings.currency] || "$"
    };

    quotationService.saveSettings(finalSettings);
    setSettings(finalSettings);
    
    // Notify
    try {
      await quotationService.addNotification({
        type: "system",
        title: "System Settings Updated",
        message: "GST rates, labour costs, and branding coordinates have been modified."
      });
    } catch (err) {
      console.error("Failed to add notification:", err);
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4 dark:border-white/10">
        <div className="p-2 bg-brand-gold/15 text-brand-bronze dark:text-brand-gold rounded-lg">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-brand-bronze dark:text-brand-gold">
            System Settings
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Configure tax multipliers, labour charges, default currencies, and branding details.
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250 animate-scale-up text-xs font-semibold">
          <CheckCircle className="h-4 w-4" />
          <span>System configurations updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Columns: Parameters */}
        <div className="md:col-span-2 space-y-6">
          {/* Company Branding */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10">
              Corporate Branding Coordinates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Corporate Email</label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Corporate Phone</label>
                <input
                  type="text"
                  value={settings.companyPhone}
                  onChange={(e) => handleInputChange("companyPhone", e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Headquarters Address</label>
                <input
                  type="text"
                  value={settings.companyAddress}
                  onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          {/* Pricing Parameters */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10">
              Quotation Calculators Standards
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Default GST/Tax (%)</label>
                <input
                  type="number"
                  value={settings.gstPercentage}
                  onChange={(e) => handleInputChange("gstPercentage", Number(e.target.value))}
                  className="glass-input"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Default Labour Rate (/sq ft)</label>
                <input
                  type="number"
                  value={settings.defaultLabourCharges}
                  onChange={(e) => handleInputChange("defaultLabourCharges", Number(e.target.value))}
                  className="glass-input"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-500">Standard Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="glass-input cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logo Upload & Preferences */}
        <div className="space-y-6">
          {/* Logo Uploader */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4 flex flex-col items-center">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10 w-full text-center">
              Brand Logo
            </h3>
            <div className="relative h-24 w-24 border-2 border-dashed border-gray-300 dark:border-white/15 rounded-full flex items-center justify-center overflow-hidden bg-brand-cream/40 dark:bg-brand-darkgray/10 group shadow-inner">
              {logo ? (
                <img src={logo} alt="Company Logo" className="h-full w-full object-contain" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-300" />
              )}
            </div>

            {/* Input file button */}
            <label className="flex items-center gap-2 bg-brand-gold/10 text-brand-bronze dark:bg-brand-gold/25 dark:text-brand-gold px-3.5 py-2 rounded-lg text-xxs font-bold hover:bg-brand-gold/20 transition-all focus:outline-none cursor-pointer border dark:border-brand-gold/10">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Custom Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="sr-only"
                id="logo-upload-input"
              />
            </label>
            {logo && (
              <button
                type="button"
                onClick={() => {
                  setLogo("");
                  storage.remove("qaems_logo");
                  window.dispatchEvent(new Event("logo_changed"));
                }}
                className="text-[10px] text-red-500 hover:underline"
              >
                Remove Logo
              </button>
            )}
          </div>

          {/* Preferences Card */}
          <div className="glass-panel p-6 rounded-2xl border dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold border-b pb-2 dark:border-white/10">
              Workspace Preferences
            </h3>

            {/* Theme selector */}
            <div className="flex justify-between items-center text-xs pb-3 border-b dark:border-white/5">
              <div className="flex flex-col">
                <span className="font-semibold text-brand-charcoal dark:text-brand-cream">Active Theme</span>
                <span className="text-xxs text-gray-400">Current mode is {theme}</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1 bg-brand-gold/10 text-brand-bronze dark:bg-brand-gold/25 dark:text-brand-gold px-3 py-1.5 rounded-lg text-xxs font-bold hover:bg-brand-gold/20 transition-all focus:outline-none"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Toggle Mode
              </button>
            </div>

            {/* Notification checkboxes */}
            <div className="space-y-3 pt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleCheckboxChange("emailNotifications")}
                  className="rounded border-gray-300 text-brand-bronze focus:ring-brand-gold cursor-pointer"
                />
                <span>Email Client Notifications</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleCheckboxChange("pushNotifications")}
                  className="rounded border-gray-300 text-brand-bronze focus:ring-brand-gold cursor-pointer"
                />
                <span>Browser Push Alerts</span>
              </label>
            </div>
          </div>

          {/* Submit panel */}
          <button
            type="submit"
            className="w-full glass-btn-primary flex items-center justify-center gap-2 text-xs shadow-md"
            id="settings-save-btn"
          >
            <Save className="h-4 w-4" />
            Save Configurations
          </button>
        </div>
      </form>
    </div>
  );
}
