import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TourContext = createContext(null);

export const TOUR_STEPS = [
  {
    step: 1,
    title: "Executive Dashboard",
    path: "/dashboard",
    description: "Your operational command center. Monitor critical KPIs (Total Quotations, Conversion Rate, and Revenue metrics) with interactive analytics, chart filters, and quick-action shortcuts."
  },
  {
    step: 2,
    title: "Customer CRM",
    path: "/customers",
    description: "Manage client relationships in real-time. Add, update, and search customer profiles, and track historical client activity timelines in a unified panel."
  },
  {
    step: 3,
    title: "Quotation Builder",
    path: "/new-quotation",
    description: "Calculate custom estimates instantly by configuring room parameters, materials, furniture elements, lighting, labor, taxes, and client discounts."
  },
  {
    step: 4,
    title: "Estimate Preview",
    path: "/estimate-preview",
    description: "Generate polished, client-ready quotes with custom tax statements, professional Glory Simon Interiors branding, and one-click PDF printing."
  },
  {
    step: 5,
    title: "Invoice & Payments",
    path: "/payments",
    description: "Track billing cycles, record client payments, and monitor invoices marked as Paid, Pending, or Overdue to keep project cashflow healthy."
  },
  {
    step: 6,
    title: "Project Kanban Workflow",
    path: "/project-workflow",
    description: "Visual board displaying stages of project execution: Design Concept, Procurement, Site Preparation, Installation, and Final Handover."
  },
  {
    step: 7,
    title: "Reports & Analytics",
    path: "/reports",
    description: "Explore business trends over time. Drill down by room categories or materials, print summaries, and download CSV export files."
  },
  {
    step: 8,
    title: "AI Interior Assistant",
    path: "/assistant",
    description: "Chat with the simulated AI model to receive immediate room styling recommendations, furniture choices, lighting designs, and estimate ranges."
  },
  {
    step: 9,
    title: "Workspace Settings",
    path: "/settings",
    description: "Configure workspace parameters. Fine-tune default tax margins, design fees, brand details, and set light/dark mode preferences."
  }
];

export const TourProvider = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load tour state from storage if it was active
  useEffect(() => {
    const savedTourState = sessionStorage.getItem("qaems_tour_active");
    const savedStep = sessionStorage.getItem("qaems_tour_step");
    if (savedTourState === "true") {
      setIsTourActive(true);
      if (savedStep) {
        setCurrentStepIndex(parseInt(savedStep, 10));
      }
    }
  }, []);

  const startTour = () => {
    setIsTourActive(true);
    setCurrentStepIndex(0);
    setIsMinimized(false);
    sessionStorage.setItem("qaems_tour_active", "true");
    sessionStorage.setItem("qaems_tour_step", "0");
    
    // Navigate to first step
    navigate(TOUR_STEPS[0].path);
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      sessionStorage.setItem("qaems_tour_step", nextIdx.toString());
      navigate(TOUR_STEPS[nextIdx].path);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      sessionStorage.setItem("qaems_tour_step", prevIdx.toString());
      navigate(TOUR_STEPS[prevIdx].path);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setCurrentStepIndex(0);
    sessionStorage.removeItem("qaems_tour_active");
    sessionStorage.removeItem("qaems_tour_step");
  };

  // Sync step index if page is changed manually by user clicking links during the tour
  useEffect(() => {
    if (isTourActive) {
      const activeStepPath = TOUR_STEPS[currentStepIndex].path;
      // If user navigated away manually, let's sync step if it matches a tour page path
      if (location.pathname !== activeStepPath) {
        const matchingIndex = TOUR_STEPS.findIndex(step => step.path === location.pathname);
        if (matchingIndex !== -1) {
          setCurrentStepIndex(matchingIndex);
          sessionStorage.setItem("qaems_tour_step", matchingIndex.toString());
        }
      }
    }
  }, [location.pathname, isTourActive, currentStepIndex]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep: TOUR_STEPS[currentStepIndex],
        isMinimized,
        setIsMinimized,
        startTour,
        nextStep,
        prevStep,
        endTour,
        totalSteps: TOUR_STEPS.length
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
