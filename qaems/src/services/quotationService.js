import { storage } from "../utils/storage";
import { api } from "./api";

// Local Settings & Vendors fallbacks
const KEYS = {
  SETTINGS: "qaems_settings",
  VENDORS: "qaems_vendors"
};

const DEFAULT_SETTINGS = {
  companyName: "Glory Simon Interiors",
  companyAddress: "102, Design Avenue, Suite A, New York, NY",
  companyEmail: "info@glorysimon.com",
  companyPhone: "+1 (555) 987-6543",
  gstPercentage: 18,
  defaultLabourCharges: 15,
  currency: "USD",
  currencySymbol: "$"
};

const MOCK_VENDORS = [
  { id: "VND-001", name: "Apex Woodworks", specialty: "Modular Kitchen & Wardrobe Fabrication", phone: "555-0901", email: "orders@apexwood.com", rating: 4.8, activeProjects: 3, status: "Active" },
  { id: "VND-002", name: "Luxor Lighting Systems", specialty: "Smart & Decorative Lights Provider", phone: "555-0902", email: "b2b@luxor.com", rating: 4.5, activeProjects: 2, status: "Active" },
  { id: "VND-003", name: "Vogue Fabrics & Wall Coverings", specialty: "Upholstery, Curtains & Premium Wallpapers", phone: "555-0903", email: "design@voguefabrics.com", rating: 4.2, activeProjects: 1, status: "Active" },
  { id: "VND-004", name: "Stonex Marble & Granite", specialty: "Premium Countertops & Tile Supply", phone: "555-0904", email: "sales@stonex.com", rating: 4.9, activeProjects: 4, status: "Active" },
  { id: "VND-005", name: "EcoPaint Co.", specialty: "Non-toxic & Custom Textured Paints", phone: "555-0905", email: "contractors@ecopaint.com", rating: 4.0, activeProjects: 0, status: "Inactive" }
];

// Helper to sanitize payload for quotation validator requirements
const sanitizeQuotationPayload = (params) => {
  const sanitized = { ...params };
  
  if (sanitized.area !== undefined && sanitized.area !== "") {
    sanitized.area = Number(sanitized.area);
  } else {
    delete sanitized.area;
  }
  
  if (sanitized.numRooms !== undefined && sanitized.numRooms !== "") {
    sanitized.numRooms = Number(sanitized.numRooms);
  }
  
  if (sanitized.labourCost !== undefined && sanitized.labourCost !== "") {
    sanitized.labourCost = Number(sanitized.labourCost);
  } else {
    delete sanitized.labourCost;
  }

  if (sanitized.taxPercentage !== undefined && sanitized.taxPercentage !== "") {
    sanitized.taxPercentage = Number(sanitized.taxPercentage);
    sanitized.tax = sanitized.taxPercentage;
  } else {
    delete sanitized.taxPercentage;
    delete sanitized.tax;
  }

  if (sanitized.discountPercentage !== undefined && sanitized.discountPercentage !== "") {
    sanitized.discountPercentage = Number(sanitized.discountPercentage);
    sanitized.discount = sanitized.discountPercentage;
  } else {
    delete sanitized.discountPercentage;
    delete sanitized.discount;
  }

  if (sanitized.installationCharges !== undefined && sanitized.installationCharges !== "") {
    sanitized.installationCharges = Number(sanitized.installationCharges);
  } else {
    delete sanitized.installationCharges;
  }

  if (sanitized.otherCharges !== undefined && sanitized.otherCharges !== "") {
    sanitized.otherCharges = Number(sanitized.otherCharges);
  } else {
    delete sanitized.otherCharges;
  }

  if (sanitized.clientId === "new") {
    delete sanitized.clientId;
  }

  return sanitized;
};

// Helper to sanitize client payload
const sanitizeClientPayload = (clientData) => {
  return {
    ...clientData,
    status: clientData.stage || clientData.status || "Lead"
  };
};

export const quotationService = {
  // Local Settings
  getSettings: () => {
    return storage.get(KEYS.SETTINGS) || DEFAULT_SETTINGS;
  },
  saveSettings: (settings) => {
    storage.set(KEYS.SETTINGS, settings);
    return settings;
  },

  // Local Vendors
  getVendors: () => {
    return storage.get(KEYS.VENDORS) || MOCK_VENDORS;
  },

  // Clients API
  getClients: async () => {
    const clients = await api.get("/clients");
    return clients.map(c => ({
      ...c,
      stage: c.status || c.stage || 'Lead'
    }));
  },
  getClientById: async (id) => {
    const c = await api.get(`/clients/${id}`);
    return c ? {
      ...c,
      stage: c.status || c.stage || 'Lead'
    } : null;
  },
  createClient: async (clientData) => {
    const payload = sanitizeClientPayload(clientData);
    const newClient = await api.post("/clients", payload);
    return {
      ...newClient,
      stage: newClient.status || newClient.stage || 'Lead'
    };
  },
  updateClient: async (id, clientData) => {
    const payload = sanitizeClientPayload(clientData);
    const updatedClient = await api.put(`/clients/${id}`, payload);
    return {
      ...updatedClient,
      stage: updatedClient.status || updatedClient.stage || 'Lead'
    };
  },
  deleteClient: async (id) => {
    return api.delete(`/clients/${id}`);
  },

  // Quotations API
  getQuotations: async () => {
    const quotes = await api.get("/quotations");
    return quotes.map(q => ({
      ...q,
      date: q.createdAt ? q.createdAt.split('T')[0] : 'N/A'
    }));
  },
  getQuotationById: async (id) => {
    const q = await api.get(`/quotations/${id}`);
    return q ? {
      ...q,
      date: q.createdAt ? q.createdAt.split('T')[0] : 'N/A'
    } : null;
  },
  calculateQuotation: async (params) => {
    const payload = sanitizeQuotationPayload(params);
    return api.post("/quotations/calculate", payload);
  },
  createQuotation: async (quoteData) => {
    const payload = sanitizeQuotationPayload(quoteData);
    const newQuote = await api.post("/quotations", payload);
    return {
      ...newQuote,
      date: newQuote.createdAt ? newQuote.createdAt.split('T')[0] : 'N/A'
    };
  },
  updateQuotation: async (id, quoteData) => {
    const payload = sanitizeQuotationPayload(quoteData);
    const updatedQuote = await api.put(`/quotations/${id}`, payload);
    return {
      ...updatedQuote,
      date: updatedQuote.createdAt ? updatedQuote.createdAt.split('T')[0] : 'N/A'
    };
  },
  updateQuotationStatus: async (id, status) => {
    const updated = await api.patch(`/quotations/${id}/status`, { status });
    return {
      ...updated,
      date: updated.createdAt ? updated.createdAt.split('T')[0] : 'N/A'
    };
  },
  deleteQuotation: async (id) => {
    return api.delete(`/quotations/${id}`);
  },

  // Site Visits API
  getSiteVisits: async () => {
    const visits = await api.get("/site-visits");
    return visits.map(v => ({
      ...v,
      date: v.visitDate ? v.visitDate.substring(0, 10) : 'N/A',
      location: v.location || v.address,
      designer: v.designer || v.assignedDesigner
    }));
  },
  createSiteVisit: async (visitData) => {
    const newVisit = await api.post("/site-visits", visitData);
    return {
      ...newVisit,
      date: newVisit.visitDate ? newVisit.visitDate.substring(0, 10) : 'N/A',
      location: newVisit.location || newVisit.address,
      designer: newVisit.designer || newVisit.assignedDesigner
    };
  },
  updateSiteVisitStatus: async (id, status) => {
    // To satisfy express-validator, first retrieve details and merge status before PUT
    const visit = await api.get(`/site-visits/${id}`);
    const updated = await api.put(`/site-visits/${id}`, {
      ...visit,
      status
    });
    return {
      ...updated,
      date: updated.visitDate ? updated.visitDate.substring(0, 10) : 'N/A',
      location: updated.location || updated.address,
      designer: updated.designer || updated.assignedDesigner
    };
  },

  // Notifications API
  getNotifications: async () => {
    const list = await api.get("/notifications");
    return list.map(n => ({
      ...n,
      time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'N/A'
    }));
  },
  markAllNotificationsRead: async () => {
    return api.post("/notifications/read-all", {});
  },
  markNotificationRead: async (id) => {
    return api.put(`/notifications/${id}/read`, {});
  },

  // Dashboard API
  getAnalytics: async () => {
    return api.get("/dashboard/summary");
  },
  getRecentActivities: async () => {
    try {
      return await api.get("/dashboard/activities");
    } catch (e) {
      console.warn("Failed to fetch dashboard activities, gracefully falling back to empty list", e);
      return [];
    }
  },
  getUpcomingVisits: async () => {
    return api.get("/dashboard/site-visits");
  },

  // Reports API
  getRevenueReport: async () => {
    return api.get("/reports/revenue");
  },
  getClientReport: async () => {
    return api.get("/reports/clients");
  },
  getQuotationReport: async () => {
    return api.get("/reports/quotations");
  },
  getApprovalReport: async () => {
    return api.get("/reports/approvals");
  },

  // Invoices Local Storage Fallback Integration
  getInvoices: () => {
    if (!storage.get("qaems_invoices")) {
      storage.set("qaems_invoices", [
        { id: "INV-2026-001", quoteId: "Q-2026-001", clientName: "David Harrison", amount: 32450, status: "Pending", date: "2026-06-05", dueDate: "2026-07-05", notes: "50% Mobilization advance payment request for Living Room overhaul." },
        { id: "INV-2026-002", quoteId: "Q-2026-003", clientName: "Marcus Vance", amount: 19800, status: "Paid", date: "2026-06-15", dueDate: "2026-06-30", notes: "Full payment received for modular kitchen fabrication." },
        { id: "INV-2026-003", quoteId: "Q-2026-004", clientName: "Emily Watson", amount: 8500, status: "Overdue", date: "2026-06-01", dueDate: "2026-06-15", notes: "Consultation and site plan blueprint charges overdue." }
      ]);
    }
    return storage.get("qaems_invoices") || [];
  },
  createInvoice: (invoiceData) => {
    const invoices = quotationService.getInvoices();
    const id = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const newInvoice = {
      ...invoiceData,
      id,
      date: new Date().toISOString().split("T")[0],
      status: invoiceData.status || "Pending"
    };
    invoices.push(newInvoice);
    storage.set("qaems_invoices", invoices);

    // Trigger Notification
    quotationService.addNotification({
      title: "Invoice Issued",
      message: `Invoice ${id} for amount ${quotationService.getSettings().currencySymbol}${Number(invoiceData.amount).toLocaleString()} issued to ${invoiceData.clientName}.`
    });

    return newInvoice;
  },
  updateInvoiceStatus: (id, status) => {
    const invoices = quotationService.getInvoices();
    const index = invoices.findIndex((i) => i.id === id);
    if (index === -1) return null;
    invoices[index].status = status;
    storage.set("qaems_invoices", invoices);
    return invoices[index];
  },
  addNotification: async (notificationData) => {
    try {
      return await api.post("/notifications", notificationData);
    } catch (err) {
      console.error("Failed to add notification:", err);
    }
  },
  getWorkflow: () => {
    if (!storage.get("qaems_workflow")) {
      storage.set("qaems_workflow", {
        enquiry: [
          { id: "KB-1", title: "Emma Stone - Bedroom Makeover", budget: "$4,000", date: "June 18" },
          { id: "KB-2", title: "Zen Cafe - Commercial Redesign", budget: "$15,000", date: "June 17" }
        ],
        siteVisitScheduled: [
          { id: "KB-3", title: "David Harrison - Space Scanning", budget: "$12,500", date: "June 21" }
        ],
        siteVisitCompleted: [
          { id: "KB-4", title: "Sonia Martinez - Office Measurement", budget: "$28,000", date: "June 12" }
        ],
        designApproval: [
          { id: "KB-5", title: "Liam Neeson - Dining Cabinetry", budget: "$6,500", date: "June 12" }
        ],
        quotationGenerated: [
          { id: "KB-6", title: "Robert Downey - Conference Room", budget: "$82,000", date: "June 18" }
        ],
        quotationSent: [
          { id: "KB-10", title: "Scarlett Johansson - Home Study", budget: "$10,500", date: "June 19" }
        ],
        approved: [
          { id: "KB-7", title: "Marcus Vance - Quartz Kitchen", budget: "$16,200", date: "June 15" }
        ],
        execution: [
          { id: "KB-8", title: "Christian Bale - Penthouse Study", budget: "$25,000", date: "May 29" }
        ],
        completed: [
          { id: "KB-9", title: "Anne Hathaway - Cozy Nursery", budget: "$8,500", date: "May 15" }
        ]
      });
    }
    return storage.get("qaems_workflow");
  },
  saveWorkflow: (workflow) => {
    storage.set("qaems_workflow", workflow);
    return workflow;
  }
};
