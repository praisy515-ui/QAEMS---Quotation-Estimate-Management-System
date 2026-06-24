import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import NewQuotation from "./pages/NewQuotation";
import EstimatePreview from "./pages/EstimatePreview";
import QuotationHistory from "./pages/QuotationHistory";
import QuotationDetails from "./pages/QuotationDetails";
import Customers from "./pages/Customers";
import ClientDetails from "./pages/ClientDetails";
import SiteVisits from "./pages/SiteVisits";
import MaterialSelection from "./pages/MaterialSelection";
import Vendors from "./pages/Vendors";
import ProjectWorkflow from "./pages/ProjectWorkflow";
import Payments from "./pages/Payments";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ProjectDemo from "./pages/ProjectDemo";
import Approvals from "./pages/Approvals";
import Unauthorized from "./pages/Unauthorized";

// Presentation Hub Pages
import AboutProject from "./pages/presentation/AboutProject";
import Architecture from "./pages/presentation/Architecture";
import TechStack from "./pages/presentation/TechStack";
import TeamInfo from "./pages/presentation/TeamInfo";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TourProvider } from "./context/TourContext";

// Navigation Route Gates
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <TourProvider>
            <Routes>
              {/* Public Authentications */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected SaaS Dashboards */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/new-quotation"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <NewQuotation />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estimate-preview"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EstimatePreview />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotation-history"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QuotationHistory />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quotation-details"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QuotationDetails />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Customers />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client-details"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ClientDetails />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/site-visits"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SiteVisits />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/material-selection"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MaterialSelection />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendors"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Vendors />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-workflow"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProjectWorkflow />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Payments />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assistant"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AIAssistant />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approvals"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Approvals />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-demo"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProjectDemo />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Presentation Pages */}
              <Route
                path="/about-project"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AboutProject />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/architecture"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Architecture />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tech-stack"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TechStack />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team-info"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TeamInfo />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </TourProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}