import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTour } from "../context/TourContext";
import { quotationService } from "../services/quotationService";
import { storage } from "../utils/storage";
import ThemeToggle from "./ThemeToggle";
import { Menu, Bell, Search, LogOut, User, ChevronDown, Compass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const { startTour } = useTour();
  const navigate = useNavigate();

  // State Profile Dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    clients: [],
    quotations: [],
    invoices: [],
    visits: [],
    vendors: []
  });
  const [searchFocused, setSearchFocused] = useState(false);

  // Load Notifications & Listen for updates
  useEffect(() => {
    const loadNtf = async () => {
      try {
        const list = await quotationService.getNotifications();
        const safeList = Array.isArray(list) ? list : [];
        setNotifications(safeList.slice(0, 5)); // show latest 5
        setUnreadCount(safeList.filter((n) => n.status === "Unread" || !n.read).length);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    loadNtf();

    // Listen to storage mutations to sync read status
    window.addEventListener("storage", loadNtf);
    return () => {
      window.removeEventListener("storage", loadNtf);
    };
  }, []);

  // Global Search Controller
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ clients: [], quotations: [], invoices: [], visits: [], vendors: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const performSearch = async () => {
      try {
        const [allClients, allQuotes, allVisits] = await Promise.all([
          quotationService.getClients().catch(() => []),
          quotationService.getQuotations().catch(() => []),
          quotationService.getSiteVisits().catch(() => [])
        ]);
        const allVendors = quotationService.getVendors() || [];
        const allInvoices = []; // local fallback or empty

        const filteredClients = allClients.filter(c => 
          (c.name && c.name.toLowerCase().includes(query)) || 
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.phone && c.phone.includes(query))
        ).slice(0, 3);

        const filteredQuotes = allQuotes.filter(q => 
          (q.id && q.id.toLowerCase().includes(query)) || 
          (q.clientName && q.clientName.toLowerCase().includes(query)) ||
          (q.roomType && q.roomType.toLowerCase().includes(query))
        ).slice(0, 3);

        const filteredInvoices = allInvoices.filter(i => 
          (i.id && i.id.toLowerCase().includes(query)) || 
          (i.clientName && i.clientName.toLowerCase().includes(query)) ||
          (i.quoteId && i.quoteId.toLowerCase().includes(query))
        ).slice(0, 3);

        const filteredVisits = allVisits.filter(v => 
          (v.clientName && v.clientName.toLowerCase().includes(query)) || 
          (v.designer && v.designer.toLowerCase().includes(query)) ||
          (v.location && v.location.toLowerCase().includes(query))
        ).slice(0, 3);

        const filteredVendors = allVendors.filter(v => 
          (v.name && v.name.toLowerCase().includes(query)) || 
          (v.specialty && v.specialty.toLowerCase().includes(query))
        ).slice(0, 3);

        setSearchResults({
          clients: filteredClients,
          quotations: filteredQuotes,
          invoices: filteredInvoices,
          visits: filteredVisits,
          vendors: filteredVendors
        });
      } catch (err) {
        console.error("Global search failed:", err);
      }
    };

    performSearch();
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkAllRead = async () => {
    try {
      await quotationService.markAllNotificationsRead();
      // Reload notifications
      const list = await quotationService.getNotifications();
      const safeList = Array.isArray(list) ? list : [];
      setNotifications(safeList.slice(0, 5));
      setUnreadCount(0);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await quotationService.markNotificationRead(id);
      const list = await quotationService.getNotifications();
      const safeList = Array.isArray(list) ? list : [];
      setNotifications(safeList.slice(0, 5));
      setUnreadCount(safeList.filter(n => n.status === "Unread" || !n.read).length);
      window.dispatchEvent(new Event("storage"));
      setNotificationDropdownOpen(false);
    } catch (err) {
      console.error("Failed to handle notification click:", err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md dark:border-white/10 dark:bg-brand-charcoal/80 no-print select-none">
      {/* Left side: Hamburger & Brand Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-brand-darkgray lg:hidden focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-brand-charcoal dark:text-brand-cream" />
        </button>
        <div className="hidden flex-col md:flex">
          <span className="text-sm font-bold tracking-tight text-brand-bronze dark:text-brand-gold font-display uppercase leading-none">
            Glory Simon Interiors
          </span>
          <span className="text-[8px] italic text-gray-400 font-bold mt-1.5 leading-none select-none">
            "Designing Spaces, Building Dreams."
          </span>
        </div>
      </div>

      {/* Center: Universal Categorized Search */}
      <div className="relative max-w-md flex-1 px-4 hidden sm:block">
        <div className="pointer-events-none absolute inset-y-0 left-7 flex items-center">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search clients, quotes, invoices, audits, vendors..."
          className="w-full pl-10 pr-4 py-1.5 text-xs rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/45 focus:border-brand-gold transition-all dark:border-white/10 dark:bg-brand-darkgray/55 dark:focus:bg-brand-darkgray"
          id="global-search-input"
        />

        {searchFocused && searchQuery.trim().length >= 2 && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setSearchFocused(false)} />
            
            <div className="absolute left-4 right-4 mt-2 max-h-96 overflow-y-auto glass-panel p-4 rounded-xl border dark:border-white/10 shadow-xl z-20 space-y-3 bg-white dark:bg-brand-charcoal text-xxs font-medium">
              
              {searchResults.quotations.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-brand-gold uppercase tracking-wider block">Quotations</span>
                  {searchResults.quotations.map(q => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
                        navigate(`/quotation-details?id=${q.id}`);
                      }}
                      className="w-full text-left p-1.5 hover:bg-gray-50 dark:hover:bg-brand-darkgray/40 rounded flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-semibold text-brand-charcoal dark:text-brand-cream">{q.id} - {q.clientName}</span>
                      <span className="text-gray-400 font-medium">{q.roomType}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.clients.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-brand-gold uppercase tracking-wider block">Customers (CRM)</span>
                  {searchResults.clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
                        navigate(`/customers`);
                      }}
                      className="w-full text-left p-1.5 hover:bg-gray-50 dark:hover:bg-brand-darkgray/40 rounded flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-semibold text-brand-charcoal dark:text-brand-cream">{c.name}</span>
                      <span className="text-gray-400 font-medium">{c.stage}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.invoices.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-brand-gold uppercase tracking-wider block">Invoices</span>
                  {searchResults.invoices.map(i => (
                    <button
                      key={i.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
                        navigate(`/payments`);
                      }}
                      className="w-full text-left p-1.5 hover:bg-gray-50 dark:hover:bg-brand-darkgray/40 rounded flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-semibold text-brand-charcoal dark:text-brand-cream">{i.id} - {i.clientName}</span>
                      <span className="text-gray-400 font-medium">{i.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.visits.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-brand-gold uppercase tracking-wider block">Site Audits</span>
                  {searchResults.visits.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
                        navigate(`/site-visits`);
                      }}
                      className="w-full text-left p-1.5 hover:bg-gray-50 dark:hover:bg-brand-darkgray/40 rounded flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-semibold text-brand-charcoal dark:text-brand-cream">{v.clientName}</span>
                      <span className="text-gray-400 font-medium">{v.date}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.vendors.length > 0 && (
                <div className="space-y-1">
                  <span className="font-bold text-brand-gold uppercase tracking-wider block">Vendors</span>
                  {searchResults.vendors.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
                        navigate(`/vendors`);
                      }}
                      className="w-full text-left p-1.5 hover:bg-gray-50 dark:hover:bg-brand-darkgray/40 rounded flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-semibold text-brand-charcoal dark:text-brand-cream">{v.name}</span>
                      <span className="text-gray-400 font-medium">{v.specialty}</span>
                    </button>
                  ))}
                </div>
              )}

              {Object.values(searchResults).every(arr => arr.length === 0) && (
                <div className="py-6 text-center text-gray-400 font-medium">
                  No matching records found.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right side: Alert bell & profile toggles */}
      <div className="flex items-center gap-3">
        {/* Workspace Tour Launch Button */}
        <button
          onClick={startTour}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-bronze/10 to-brand-gold/15 text-brand-bronze dark:text-brand-gold border border-brand-gold/30 hover:border-brand-gold/50 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer hover:bg-brand-gold/20"
          aria-label="Start Guided Workspace Tour"
          title="Start Workspace Tour"
        >
          <Compass className="h-3.5 w-3.5 animate-spin-slow text-brand-gold" />
          <span className="hidden md:inline">Workspace Tour</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-brand-darkgray transition-colors focus:outline-none cursor-pointer"
            aria-label="View notifications"
            id="navbar-bell-btn"
          >
            <Bell className="h-5 w-5 text-brand-charcoal dark:text-brand-cream" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-bronze text-[9px] font-bold text-white dark:bg-brand-gold dark:text-brand-charcoal animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setNotificationDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white dark:border-white/10 dark:bg-brand-charcoal shadow-2xl z-20 p-4 space-y-3 max-h-96 overflow-y-auto text-xxs font-medium animate-scale-up">
                <div className="flex justify-between items-center border-b pb-2 dark:border-white/10">
                  <span className="text-xs font-bold text-brand-bronze dark:text-brand-gold uppercase tracking-wider">Alert Center</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xxs text-brand-bronze hover:underline dark:text-brand-gold font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Mark All Read
                    </button>
                  )}
                </div>

                <div className="divide-y dark:divide-white/5 space-y-2">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className={`pt-2 flex flex-col space-y-0.5 cursor-pointer hover:opacity-85 transition-opacity ${!n.read ? "border-l-2 border-brand-gold pl-2" : ""}`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold text-brand-charcoal dark:text-brand-cream leading-tight">{n.title}</span>
                          <span className="text-gray-400 font-semibold text-[8px] tracking-wide uppercase shrink-0">{n.time}</span>
                        </div>
                        <p className="text-gray-450 dark:text-gray-400 font-medium leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 font-medium">
                      All caught up! Zero alerts.
                    </div>
                  )}
                </div>

                <div className="border-t pt-2.5 mt-2 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setNotificationDropdownOpen(false)}
                    className="text-xxs font-bold text-brand-bronze hover:underline dark:text-brand-gold uppercase tracking-widest block"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <div className="h-6 w-px bg-gray-200 dark:bg-white/15"></div>

        {/* Profile Card */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-brand-darkgray transition-colors focus:outline-none cursor-pointer"
            aria-label="User profile menu"
          >
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-900/30">
              {user?.name ? user.name.charAt(0) : "A"}
            </div>
            <span className="hidden text-sm font-medium text-brand-charcoal dark:text-brand-cream md:block">
              {user?.name || "Admin"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white py-1 shadow-lg dark:border-white/10 dark:bg-brand-charcoal z-20 animate-scale-up">
                <div className="px-4 py-2 border-b dark:border-white/10">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                {(user?.role === "Admin" || user?.role === "Interior Designer" || user?.role === "Project Manager") && (
                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-brand-darkgray"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
