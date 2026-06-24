# QAEMS - Quotation & Estimate Management System

An enterprise-grade workspace application tailored for luxury interior studios, built to automate estimate compiling, proposals, client lifecycles, and project schedules.

---

## 📋 Project Description
The **Quotation & Estimate Management System (QAEMS)** is a full-stack web application designed for **Glory Simon Interiors**. It automates the creation of itemized, room-by-room client proposals, tracks lead lifecycles (CRM), schedules consultations and visits, coordinates project phases with an interactive Kanban board, manages billings and collection statuses, and features a simulated AI Interior Assistant to provide immediate material and layout suggestions.

---

## ✨ Features

1. **Multi-Role Authorization Dashboard**: 
   - Tailored interfaces for 5 key roles: Admin, Interior Designer, Project Manager, Site Engineer, and Vendor Coordinator.
   - Dynamic greetings, context-aware announcements, and real-time status counters.
2. **Interactive Quotation Builder**:
   - Cost compilation based on square footage, design tiers, material grades, lighting automation, custom labor, taxes, and discounts.
   - Live printable PDF proposal rendering with business taxation (GSTIN/SGST/CGST).
3. **Billing & Invoicing Ledger**:
   - Track billing records, total paid revenue, pending collections, and overdue invoices.
4. **CRM & Lead Manager**:
   - Search, filter, and track client leads through consultation, design, agreement, and handover phases.
5. **Interactive Kanban Workflow Board**:
   - Real-time project tracking from Concept Design through to Handover.
6. **Analytical Reports Hub**:
   - Visual charts (revenue charts, room breakdown statistics) with CSV export capability.
7. **AI Interior Assistant**:
   - Natural language chat simulator for material suggestions and costing estimates.
8. **Guided Tours & Presentation Hub**:
   - Multi-step tour guide to bypass authorization gates during evaluation.
   - Integrated academic slide deck detailing problem statement, system architecture, and tech implementation.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18
  - React Router DOM v6
  - Tailwind CSS (v3)
  - Recharts (Analytics and reporting)
  - Lucide React (Icons)
  - Vite (Build tool & bundler)
  - Local Storage API (Local state persistence)
- **Backend**:
  - Node.js & Express
  - Firebase Admin SDK (Optional remote database configuration; automatically falls back to local JSON file-based database if keys are empty)
  - CORS, Dotenv, UUID
- **Workspaces**:
  - Integrated project scripts coordinating frontend and backend dependencies under a single root.

---

## ⚙️ Installation Instructions

1. **Prerequisites**:
   - Install [Node.js](https://nodejs.org/) (v18 or higher recommended).
2. **Clone and Install**:
   - Place the project on your machine.
   - Navigate to the repository root directory.
   - Install all root, frontend, and backend dependencies with a single command:
     ```bash
     npm install
     ```

---

## 🚀 Run Instructions

### Production Mode (Recommended)
1. **Build Frontend**:
   - Compile and build the optimized React production bundle:
     ```bash
     npm run build
     ```
2. **Start Server**:
   - Run the Node.js/Express backend server:
     ```bash
     npm start
     ```
   - Open your browser and navigate to `http://localhost:5000` to access the application.

### Development Mode (Hot Reload)
- To run development servers for both applications with hot reload, run the dev servers in separate terminal tabs:
  - **Frontend**:
    ```bash
    npm run dev --prefix qaems
    ```
    (Runs on `http://localhost:5173`)
  - **Backend**:
    ```bash
    npm run dev --prefix backend
    ```
    (Runs on `http://localhost:5000`)

---

## 📁 Folder Structure

```text
QAEMS_GLORYSIMON/
├── backend/                   # Node.js + Express backend service
│   ├── config/                # Database and configuration files
│   ├── controllers/           # Route controller actions
│   ├── middleware/            # Auth and error handling filters
│   ├── routes/                # REST API endpoints
│   ├── db.json                # Local JSON database file fallback
│   ├── package.json           # Backend dependency configuration
│   └── server.js              # Server entry point
├── qaems/                     # React + Vite frontend workspace
│   ├── public/                # Static assets, icons, SVGs
│   ├── src/                   # React app source
│   │   ├── assets/            # Local images and vectors
│   │   ├── components/        # Reusable workspace UI widgets
│   │   ├── context/           # React Context state providers
│   │   ├── pages/             # Layout view pages and Presentation Deck
│   │   ├── services/          # Local API clients and Storage
│   │   └── App.jsx            # Main app router
│   ├── package.json           # Frontend dependency configuration
│   └── vite.config.js         # Vite dev/build settings
├── .gitignore                 # Root git rules
├── package.json               # Root workspace script coordinator
├── package-lock.json          # Root workspace locks
└── README.md                  # Project documentation
```

---

## 🖼️ Screenshots Section
*(Place UI screenshots here to demonstrate dashboards, CRM, Kanban board, and proposals)*
- **Dashboard Overview**: `[Insert Dashboard Screen]`
- **Interactive Quotation Builder**: `[Insert Proposal Builder Screen]`
- **Client Proposal PDF Preview**: `[Insert Proposals Preview Screen]`
- **Project Kanban Board**: `[Insert Kanban Board Screen]`

---

## 🔮 Future Scope
- **Live Database Integration**: Transition the local file database to remote SQL or document stores (Firestore/Postgres).
- **Interactive Floor Planner / CAD integration**: Allow uploading floor blueprints to auto-compile materials.
- **Client Portal**: Dedicated portal for clients to review, comment on, and sign off on proposals online.

---

## ✍️ Author Information
- **Developed for**: Glory Simon Interiors
- **Purpose**: Academic Internship Evaluator Portfolio / Production Readiness Quotation & Estimate Management System (QAEMS).
