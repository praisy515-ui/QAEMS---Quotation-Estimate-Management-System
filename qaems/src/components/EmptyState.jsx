import React from "react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/30 dark:bg-brand-darkgray/10 border border-white/20 dark:border-white/5 rounded-2xl backdrop-blur-md select-none max-w-xl mx-auto space-y-5 shadow-sm animate-scale-up">
      {Icon && (
        <div className="p-4 bg-brand-gold/10 text-brand-bronze dark:bg-brand-gold/15 dark:text-brand-gold rounded-full border border-brand-gold/20 flex items-center justify-center shadow-inner animate-pulse">
          <Icon className="h-10 w-10" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-bold font-display text-brand-bronze dark:text-brand-gold">
          {title}
        </h3>
        <p className="text-xs text-gray-400 font-medium max-w-sm leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="glass-btn-primary text-xs flex items-center justify-center gap-1.5 shadow-md px-5 py-2.5 font-bold uppercase tracking-wider"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
