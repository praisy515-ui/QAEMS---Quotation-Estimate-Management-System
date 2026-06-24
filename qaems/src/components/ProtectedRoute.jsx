import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTour } from "../context/TourContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const { isTourActive } = useTour();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-cream dark:bg-brand-charcoal">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role) && !isTourActive) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

