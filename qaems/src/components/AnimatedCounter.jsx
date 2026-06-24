import React, { useState, useEffect } from "react";

export default function AnimatedCounter({ value, duration = 800, prefix = "", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [autoPrefix, setAutoPrefix] = useState("");
  const [autoSuffix, setAutoSuffix] = useState("");

  useEffect(() => {
    const stringVal = value !== undefined && value !== null ? value.toString() : "0";
    
    // Auto-detect prefixes
    let cleanPrefix = prefix;
    if (!prefix) {
      if (stringVal.startsWith("₹")) cleanPrefix = "₹";
      else if (stringVal.startsWith("$")) cleanPrefix = "$";
      else if (stringVal.startsWith("€")) cleanPrefix = "€";
      else if (stringVal.startsWith("£")) cleanPrefix = "£";
    }
    setAutoPrefix(cleanPrefix);

    // Auto-detect suffixes
    let cleanSuffix = suffix;
    if (!suffix) {
      if (stringVal.endsWith("%")) cleanSuffix = "%";
    }
    setAutoSuffix(cleanSuffix);

    // Strip symbols for numeric animation
    const numericVal = parseFloat(stringVal.replace(/[^0-9.-]/g, ""));

    if (isNaN(numericVal)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = numericVal;
    
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(end);
      }
    }

    requestAnimationFrame(update);
  }, [value, duration, prefix, suffix]);

  const originalHasDecimal = value !== undefined && value !== null && value.toString().includes(".");
  
  let formatted = "";
  if (typeof displayValue === "number") {
    formatted = originalHasDecimal 
      ? displayValue.toFixed(1) 
      : Math.round(displayValue).toLocaleString();
  } else {
    formatted = displayValue;
  }

  return (
    <span>
      {autoPrefix}
      {formatted}
      {autoSuffix}
    </span>
  );
}
