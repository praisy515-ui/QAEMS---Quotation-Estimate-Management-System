const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');

const SEED_DATA = {
  users: [
    { id: "UID-ADMIN", email: "admin@glorysimon.com", name: "Admin User", role: "Admin", createdAt: "2026-06-19T10:00:00.000Z" },
    { id: "UID-DESIGNER", email: "designer@glorysimon.com", name: "Design Lead", role: "Interior Designer", createdAt: "2026-06-19T10:00:00.000Z" }
  ],
  clients: [
    { id: "CLI-001", name: "David Harrison", email: "david.h@example.com", phone: "555-0199", address: "742 Evergreen Terrace", projectType: "Residential", location: "Brooklyn", status: "Proposal", createdAt: "2026-05-15T12:00:00.000Z" },
    { id: "CLI-002", name: "Sonia Martinez", email: "sonia.m@example.com", phone: "555-0144", address: "89 Broadway St", projectType: "Commercial", location: "Manhattan", status: "Proposal", createdAt: "2026-05-20T12:00:00.000Z" },
    { id: "CLI-003", name: "Marcus Vance", email: "marcus.v@example.com", phone: "555-0168", address: "32 Oakridge Ln", projectType: "Residential", location: "Queens", status: "Signed", createdAt: "2026-05-10T12:00:00.000Z" },
    { id: "CLI-004", name: "Emily Watson", email: "emily.w@example.com", phone: "555-0122", address: "512 Pinecrest Road", projectType: "Residential", location: "Staten Island", status: "Lead", createdAt: "2026-06-01T12:00:00.000Z" },
    { id: "CLI-005", name: "Robert Downey", email: "tony@starkcorp.com", phone: "555-0185", address: "10880 Malibu Point", projectType: "Commercial", location: "Upstate NY", status: "Audit", createdAt: "2026-06-10T12:00:00.000Z" }
  ],
  siteVisits: [
    { id: "SV-001", clientId: "CLI-001", clientName: "David Harrison", visitDate: "2026-06-21T10:30:00.000Z", time: "10:30 AM", address: "742 Evergreen Terrace, Brooklyn", location: "742 Evergreen Terrace, Brooklyn", assignedDesigner: "Sarah Jenkins", designer: "Sarah Jenkins", status: "Scheduled", notes: "Material catalog walk-through and final space scanning.", createdAt: "2026-06-19T10:00:00.000Z" },
    { id: "SV-002", clientId: "CLI-002", clientName: "Sonia Martinez", visitDate: "2026-06-23T14:00:00.000Z", time: "02:00 PM", address: "89 Broadway St, Manhattan", location: "89 Broadway St, Manhattan", assignedDesigner: "Alex Rivera", designer: "Alex Rivera", status: "Scheduled", notes: "Site measurement and initial floor plan alignment.", createdAt: "2026-06-19T11:00:00.000Z" },
    { id: "SV-003", clientId: "CLI-003", clientName: "Marcus Vance", visitDate: "2026-06-14T16:30:00.000Z", time: "04:30 PM", address: "32 Oakridge Ln, Queens", location: "32 Oakridge Ln, Queens", assignedDesigner: "Sarah Jenkins", designer: "Sarah Jenkins", status: "Completed", notes: "Initial consultation done. Quotation request generated.", createdAt: "2026-06-12T10:00:00.000Z" },
    { id: "SV-004", clientId: "CLI-005", clientName: "Robert Downey", visitDate: "2026-06-25T11:00:00.000Z", time: "11:00 AM", address: "10880 Malibu Point, Upstate NY", location: "10880 Malibu Point, Upstate NY", assignedDesigner: "Glory Simon", designer: "Glory Simon", status: "Scheduled", notes: "Elite client site inspection.", createdAt: "2026-06-19T12:00:00.000Z" }
  ],
  quotations: [
    {
      id: "Q-2026-001",
      clientId: "CLI-001",
      clientName: "David Harrison",
      phone: "555-0199",
      email: "david.h@example.com",
      address: "742 Evergreen Terrace",
      projectType: "Residential",
      projectLocation: "Brooklyn",
      roomType: "Living Room",
      area: 450,
      numRooms: 1,
      scopeOfWork: "Complete redesign of living area including modular cabinetry, custom paint, false ceiling with cove lighting and brand new sectional seating arrangement.",
      materialLevel: "Premium",
      materialQuality: "Premium",
      furnitureItems: ["Sofa", "TV Unit"],
      furnitureOptions: { wardrobe: false, modularKitchen: false, tvUnit: true, falseCeiling: true, studyTable: false, storageUnits: true },
      lightingType: "Smart Lighting",
      labourCost: 15000,
      tax: 18,
      taxPercentage: 18,
      discount: 5,
      discountPercentage: 5,
      subtotal: 112000,
      total: 126560,
      status: "Approved",
      statusHistory: [
        { status: "Draft", timestamp: "2026-06-05T10:00:00.000Z" },
        { status: "Approved", timestamp: "2026-06-05T11:00:00.000Z" }
      ],
      costBreakdown: {
        materialCost: 81000,
        furnitureCost: 16000,
        lightingCost: 25000,
        labourCost: 15000,
        subtotal: 112000,
        taxAmount: 20160,
        discountAmount: 5600,
        grandTotal: 126560
      },
      createdAt: "2026-06-05T10:00:00.000Z"
    },
    {
      id: "Q-2026-002",
      clientId: "CLI-002",
      clientName: "Sonia Martinez",
      phone: "555-0144",
      email: "sonia.m@example.com",
      address: "89 Broadway St",
      projectType: "Commercial",
      projectLocation: "Manhattan",
      roomType: "Office",
      area: 1200,
      numRooms: 3,
      scopeOfWork: "Interior design of 3 executive cabins and reception lounge.",
      materialLevel: "Standard",
      materialQuality: "Standard",
      furnitureItems: ["Workstation"],
      furnitureOptions: { wardrobe: false, modularKitchen: false, tvUnit: false, falseCeiling: true, studyTable: true, storageUnits: true },
      lightingType: "Decorative Lighting",
      labourCost: 25000,
      tax: 18,
      taxPercentage: 18,
      discount: 10,
      discountPercentage: 10,
      subtotal: 247000,
      total: 266760,
      status: "Pending",
      statusHistory: [
        { status: "Draft", timestamp: "2026-06-12T10:00:00.000Z" }
      ],
      costBreakdown: {
        materialCost: 210000,
        furnitureCost: 15000,
        lightingCost: 12000,
        labourCost: 25000,
        subtotal: 247000,
        taxAmount: 44460,
        discountAmount: 24700,
        grandTotal: 266760
      },
      createdAt: "2026-06-12T10:00:00.000Z"
    }
  ],
  activities: [
    { id: "ACT-001", action: "Client Created", entityType: "Clients", entityId: "CLI-001", userId: "UID-ADMIN", userName: "Admin User", timestamp: "2026-06-19T12:00:00.000Z" },
    { id: "ACT-002", action: "Site Visit Scheduled", entityType: "SiteVisits", entityId: "SV-001", userId: "UID-ADMIN", userName: "Admin User", timestamp: "2026-06-19T12:30:00.000Z" }
  ],
  notifications: [
    { id: "NTF-001", title: "Quotation Q-2026-001 Approved", message: "Client David Harrison has approved the quotation for their Living Room redesign.", status: "Unread", createdAt: "2026-06-19T12:00:00.000Z" },
    { id: "NTF-002", title: "New Site Visit Scheduled", message: "A site visit for Robert Downey is scheduled on June 25th at 11:00 AM.", status: "Unread", createdAt: "2026-06-19T14:00:00.000Z" },
    { id: "NTF-003", title: "System Update", message: "QAEMS has been updated to version 2.5. Support for invoice generation and multi-user roles is live.", status: "Read", createdAt: "2026-06-18T10:00:00.000Z" }
  ]
};

const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf8');
      return SEED_DATA;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Local DB read failed, using memory fallback:", err);
    return SEED_DATA;
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Local DB write failed:", err);
  }
};

const localDb = {
  getCollection: (collectionName) => {
    const db = readDb();
    return db[collectionName] || [];
  },
  saveCollection: (collectionName, data) => {
    const db = readDb();
    db[collectionName] = data;
    writeDb(db);
  },
  getById: (collectionName, id) => {
    const list = localDb.getCollection(collectionName);
    return list.find(item => item.id === id) || null;
  },
  insert: (collectionName, item) => {
    const list = localDb.getCollection(collectionName);
    list.push(item);
    localDb.saveCollection(collectionName, list);
    return item;
  },
  update: (collectionName, id, updatedFields) => {
    const list = localDb.getCollection(collectionName);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updatedFields };
    localDb.saveCollection(collectionName, list);
    return list[idx];
  },
  delete: (collectionName, id) => {
    const list = localDb.getCollection(collectionName);
    const filtered = list.filter(item => item.id !== id);
    localDb.saveCollection(collectionName, filtered);
    return true;
  }
};

module.exports = localDb;
