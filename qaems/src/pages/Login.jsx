import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Sparkles, Home, ShieldAlert } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { email: "admin@glorysimon.com", password: "admin123", role: "Administrator" },
    { email: "designer@glorysimon.com", password: "designer123", role: "Interior Designer" }
  ];

  const handleDemoSelect = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");

    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate("/dashboard");
    } else {
      setError("Invalid email address or password");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-200 overflow-hidden select-none">
      
      {/* Left Side: Brand Showcase Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
        {/* Background Image of premium room */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-[10000ms] hover:scale-100"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Branding Overlay Details */}
        <div className="relative z-10 p-12 max-w-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg">
              <Home className="h-8 w-8" />
            </div>
            <span className="text-xl font-extrabold uppercase tracking-widest text-white font-display">
              Glory Simon
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-white leading-tight font-display">
              Designing Spaces, <br />
              Building Dreams.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              A premium, automated Quotation & Estimate Management System (QAEMS) built specifically to track clients, visits, materials, and quotations.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 flex gap-8 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <div>
              <p className="text-blue-400 font-bold text-lg">100%</p>
              <p className="mt-1">Dynamic Engine</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold text-lg">SaaS</p>
              <p className="mt-1">Pipeline Workflow</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold text-lg">AI</p>
              <p className="mt-1">Consultant Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Elegant Login Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-scale-up">
          
          {/* Header text */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-sm font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-display">
                Glory Simon
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Sign in to Portal
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Enter your credential files to access management workflows
            </p>
          </div>

          {/* Validation Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-xs font-semibold animate-shake">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="e.g. admin@glorysimon.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border border-white/30 border-t-white" />
              ) : (
                "Authenticate & Sign In"
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Guidelines (Essential for reviews) */}
          <div className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Fast-Track Demo Roles</span>
            </div>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">
              Click a role below to auto-fill mock credentials directly into the fields:
            </p>
            <div className="flex gap-2 flex-wrap">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoSelect(acc)}
                  type="button"
                  className="text-xxs px-2.5 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-white text-slate-650 bg-white/70 rounded-lg dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-blue-500 cursor-pointer transition-all"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}