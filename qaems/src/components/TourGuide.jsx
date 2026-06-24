import React from "react";
import { useTour } from "../context/TourContext";
import { ChevronRight, ChevronLeft, X, Minimize2, Maximize2, Sparkles, Map } from "lucide-react";

export default function TourGuide() {
  const {
    isTourActive,
    currentStepIndex,
    currentStep,
    isMinimized,
    setIsMinimized,
    nextStep,
    prevStep,
    endTour,
    totalSteps
  } = useTour();

  if (!isTourActive) return null;

  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce select-none no-print">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-charcoal to-brand-charcoal/90 dark:from-brand-cream dark:to-brand-cream/90 text-brand-cream dark:text-brand-charcoal border border-brand-gold/40 shadow-2xl rounded-full hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-xs"
          aria-label="Expand Tour Guide"
        >
          <Map className="h-4 w-4 text-brand-gold animate-spin-slow" />
          <span>Tour Active (Step {currentStepIndex + 1}/{totalSteps})</span>
          <Maximize2 className="h-3 w-3 ml-1 opacity-70" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm px-4 md:px-0 select-none no-print animate-slide-in">
      <div className="glass-panel overflow-hidden rounded-2xl border border-brand-gold/30 shadow-2xl bg-white/95 dark:bg-brand-charcoal/95 backdrop-blur-md transition-all duration-300">
        
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-250 dark:bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-brand-bronze to-brand-gold transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-150 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-brand-gold/15 dark:bg-brand-gold/10 text-brand-bronze dark:text-brand-gold rounded-lg border border-brand-gold/20">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </span>
              <div>
                <h4 className="text-xxs font-extrabold tracking-widest uppercase text-brand-gold">Guided Workspace Tour</h4>
                <p className="text-xxs text-gray-400 font-medium">Step {currentStepIndex + 1} of {totalSteps}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:bg-gray-150 dark:hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand-charcoal dark:hover:text-brand-cream transition-colors duration-200"
                title="Minimize Tour Widget"
                aria-label="Minimize Tour"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={endTour}
                className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Close and Exit Tour"
                aria-label="Exit Tour"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Step content */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-display text-brand-charcoal dark:text-brand-cream flex items-center gap-1.5">
              {currentStep.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {currentStep.description}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-150 dark:border-white/5">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentStepIndex === 0
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-brand-charcoal dark:text-brand-cream hover:bg-gray-150 dark:hover:bg-white/5 border border-transparent active:scale-95"
              }`}
              aria-label="Previous Step"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-brand-bronze to-brand-gold text-brand-cream hover:brightness-110 shadow-md font-semibold text-xs rounded-lg active:scale-95 transition-all duration-200"
              aria-label={currentStepIndex === totalSteps - 1 ? "Finish Tour" : "Next Step"}
            >
              <span>{currentStepIndex === totalSteps - 1 ? "Finish" : "Next"}</span>
              {currentStepIndex === totalSteps - 1 ? null : <ChevronRight className="h-3.5 w-3.5 animate-bounce-horizontal" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
