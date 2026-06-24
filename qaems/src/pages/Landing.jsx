import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <h1 className="text-5xl font-bold text-yellow-400">
        QAEMS
      </h1>

      <p className="mt-3 text-gray-300">
        Quotation & Estimate Management System
      </p>

      <button
        onClick={() => navigate("/login")}
        className="mt-6 px-6 py-2 bg-yellow-500 text-black rounded-lg"
      >
        Get Started
      </button>
    </div>
  );
}