# Release Notes - Glory Simon Interiors (QAEMS)

Welcome to the production release of the **Quotation & Estimate Management System (QAEMS)** built for **Glory Simon Interiors**. This document serves as the guide for internship evaluators, resume showcases, and deployment portfolios.

---

## 📋 Project Overview
QAEMS is an enterprise-grade React workspace application tailored for luxury interior studios. It automates the generation of multi-room client quotations, organizes customer lifecycles (CRM), schedules site visits, monitors invoice collection statuses (Paid/Pending/Overdue), and guides project timelines through an interactive Kanban board. It also features a simulated AI Interior Assistant to provide immediate material and layout suggestions.

---

## ✨ Features Implemented

### 1. Splash Screen & Login Gate
- **Splash Screen**: Displayed on startup, rendering branding headers and a fading loading bar. Auto-routes to Login.
- **Login Screen**: Features a responsive design, credentials autocomplete helper for evaluation ease, and error banners.

### 2. Multi-Role Authorization & Dashboard
- **Authorized Personas**: Supports 5 roles (Admin, Interior Designer, Project Manager, Site Engineer, Vendor Coordinator).
- **Responsive Workspace**: Banners dynamically adjust based on the user's role permissions.
- **Dynamic Welcome Banner**: Summarizes role authorization rules and showcases the slogan: *"Designing Spaces, Building Dreams."*
- **Stats counters**: Cards animate KPI numbers on load.

### 3. CRM & Client Management
- Search, filter, and track leads through lifecycle stages (Consultation, Design, Agreement, Handover).
- Renders project history logs showing design approvals, structural inspections, and billings.

### 4. Interactive Quotation Builder & PDF Preview
- Cost compiler matching square footage, design tiers, material grades, lighting automation, custom labor, tax, and discount inputs.
- Generates itemized proposals featuring local business taxation parameters (GSTIN/SGST/CGST), company branding headers, and print layouts.

### 5. Billing & Invoicing Ledger
- Aggregates invoice registers displaying billing values, paid revenue totals, and pending collection indicators.
- Displays bank wire details and signature sign-off lines in invoice details, ready for client printing.

### 6. Interactive Kanban Workflow Board
- Handles project execution stages: Concept Design, Sourcing, Preparation, Installation, Handover.
- Interactive drag-and-drop mechanics update project milestones.

### 7. Analytical Reports Hub
- Interactive pie and area charts displaying revenue trajectories over time.
- Custom filters to drill down data by room type or materials, export raw CSV files, and print reports.

### 8. AI Interior Design Assistant
- Live chatbot simulator providing immediate material suggestions and cost estimate ranges.

### 9. Academic Presentation Hub & Guided Tour
- **Presentation Deck (`/project-demo`)**: Houses problem statements, objectives, and interactive switchable system architecture diagrams.
- **Workspace Tour widget**: A floating guide widget navigating assessors through the 9 primary modules of the system, bypassing role permissions during active tour states.

---

## 🛠️ Technology Stack
- **Library**: React 18
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Persistence**: Local Storage API
- **Build Tool**: Vite (Bundle splitting and lazy loading enabled)

---

## 📁 Folder Structure
```text
qaems/
├── dist/                     # Compiled production asset build
├── public/                   # Public SVGs and icons
├── src/
│   ├── assets/               # Image assets and SVG files
│   ├── components/           # Reusable UI parts
│   │   ├── AnimatedCounter.jsx   # Numerical KPI animations
│   │   ├── DashboardCard.jsx     # Stats indicator cards
│   │   ├── EmptyState.jsx       # Standardized empty states
│   │   ├── PageLoader.jsx       # Suspense backdrop loader
│   │   ├── ProtectedRoute.jsx   # Role access filter
│   │   ├── Sidebar.jsx          # Category menu navigation
│   │   ├── TourGuide.jsx        # Floating guided tour assistant
│   │   └── ...
│   ├── context/              # Context Providers (Auth, Theme, Tour)
│   ├── pages/                # Workspace page modules
│   │   ├── ProjectDemo.jsx      # Internship review presentation deck
│   │   ├── Dashboard.jsx        # Analytics charts and actions
│   │   ├── NewQuotation.jsx     # Cost estimation calculator
│   │   ├── EstimatePreview.jsx  # Printable client proposals
│   │   ├── presentation/        # Tech Stack and Team Info pages
│   │   └── ...
│   ├── services/             # Local Storage queries
│   ├── utils/                # Calculation formulas and validations
│   ├── App.jsx               # Route mappings and layouts
│   ├── index.css             # Base styles and focus rings
│   └── main.jsx              # App entry point
├── package.json              # Module dependency lists
└── vite.config.js            # Bundler rules
```

---

## 🔑 Demo Credentials
Log in with any of these credentials to check different role perspectives:

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Admin** | `admin@glorysimon.com` | `admin123` | All pages, settings, invoice controls, full overrides |
| **Interior Designer** | `designer@glorysimon.com` | `designer123` | Quotation Builder, CRM, Visits, AI Assistant, Settings |
| **Project Manager** | `manager@glorysimon.com` | `manager123` | Quote History, Visits, Invoices, Kanban Board, Reports |
| **Site Engineer** | `engineer@glorysimon.com` | `engineer123` | Site Visits, Material Selection, Kanban Board |
| **Vendor Coordinator** | `coordinator@glorysimon.com` | `coordinator123` | Material Lists, Vendor Database |

---

## 🌐 Routes List
- `/` - Landing Hero
- `/splash` - Brand Loader Splash
- `/login` - Auth Screen
- `/unauthorized` - Gate Block Fallback
- `/dashboard` - Overview Center
- `/new-quotation` - Estimate Generator
- `/estimate-preview` - Client Proposal Sheet
- `/customers` - Lead CRM
- `/quotation-history` - Historic Proposals list
- `/quotation-details` - Single Proposal details
- `/site-visits` - Consultation Calendar
- `/material-selection` - Product Selector
- `/vendors` - Supplier Database
- `/project-workflow` - Kanban Board
- `/payments` - Invoice Ledger
- `/reports` - Financial Reports Hub
- `/assistant` - AI Chatbot
- `/settings` - Workspace Controls
- `/notifications` - Alert Center
- `/project-demo` - Presentation Portfolio Deck

---

## 🧪 Testing Checklist

### 1. Functional Integrity
- [x] Session tokens persist after refresh.
- [x] Bypasses role blocks when Guided Tour mode is active.
- [x] Correct tax (CGST + SGST) calculation on proposal sheets.
- [x] Real-time search indexing for names and invoice codes.
- [x] CSV downloads of reports function correctly.

### 2. Spacing & Responsiveness
- [x] Sidebar auto-hides on mobile and displays a toggle trigger in the navbar.
- [x] Tables use horizontal scrolls to prevent layout breakage on mobile viewports (320px+).
- [x] Form inputs stack vertically on narrow devices.
- [x] Print media hides headers and navigation, formatting documents inside high-contrast A4 print sheets.

### 3. Accessibility & UX
- [x] Keyboard tab traversal maps to focus rings styled in warm gold.
- [x] Page loading shows a glowing luxury spinning fallback widget.
- [x] Image inputs support alt strings, and interactive controls feature aria-label tags.

---

## ⚠️ Known Limitations
- **Data Range**: Data is persisted locally inside the browser's `localStorage` state. Resetting browser cookies/cache resets data to default seeding values.
- **AI responses**: The chatbot replies with simulated responses from static design templates rather than calling live remote web API keys.

---

## 🔮 Future Scope
- **API integrations**: Syncing with database backends (Node.js/Django) and live payment gateways.
- **CAD Syncing**: Syncing floor layout blueprint drawings directly with calculations.
- **Design Board**: Shared live boards for multi-designer real-time feedback.
