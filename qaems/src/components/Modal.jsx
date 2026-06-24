import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  // Bind escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // lock background scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Background click handler */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-brand-charcoal border dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up z-10 glass-panel">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-white/10 bg-gray-50/50 dark:bg-brand-darkgray/25">
          <h3 className="text-lg font-bold font-display text-brand-bronze dark:text-brand-gold">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-brand-darkgray dark:hover:text-brand-cream focus:outline-none transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-brand-charcoal/80 dark:text-brand-cream/80">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t dark:border-white/10 bg-gray-50/30 dark:bg-brand-darkgray/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
