import React from "react";

export default function LoadingSpinner({ size = "md", inline = false }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4"
  };

  const containerClasses = inline
    ? "flex items-center justify-center p-2"
    : "flex flex-col items-center justify-center p-8 space-y-3";

  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-brand-gold/20 border-t-brand-bronze`}
      ></div>
      {!inline && (
        <span className="text-sm font-medium text-brand-bronze/70 dark:text-brand-gold/70 animate-pulse font-display">
          Glory Simon Interiors...
        </span>
      )}
    </div>
  );
}
