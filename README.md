# CIVICLENS — AI-Powered Municipal Complaint Triage Platform
> *Turning Citizen Complaints Into Action.*

---

## Executive Overview
**CivicLens** is an enterprise-grade civic complaint intelligence platform engineered to transform unstructured citizen reports—submitted in plain text, regional languages (such as Kannada and Hindi), or with photo evidence—into structured, prioritized, and deterministically routed municipal service tickets.

By eliminating manual dispatch bottlenecks and automating severity classification according to public safety urgency, CivicLens drastically accelerates municipal resolution times and empowers civic authorities with spatial ward-level intelligence.

---

## 🏛️ System Architecture

```
                  ┌────────────────────────────────────────┐
                  │            Citizen Portal              │
                  │  (Text, Regional Input, Photo Upload)  │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │       CivicLens AI Triage Engine       │
                  │   Language Detection • Classification  │
                  │   Severity Assessment • Risk Scoring   │
                  └─────────┬───────────────────┬──────────┘
                            │                   │
                 Deterministic Routing     Duplicate Detection
                            │                   │
                            ▼                   ▼
                  ┌───────────────────┐  ┌─────────────────┐
                  │ Municipal Ticket  │  │ Duplicate Group │
                  │  (CRITICAL->LOW)  │  │   Clustering    │
                  └─────────┬─────────┘  └─────────────────┘
                            │
                            ▼
                  ┌────────────────────────────────────────┐
                  │       Officer Command Center           │
                  │ Priority Queue • Audit Trail • Charts  │
                  └────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. Mandatory Competition Requirements
- **Citizen Complaint Submission Portal**:
  - Full complaint description support.
  - Multi-lingual input with automatic detection (English, Kannada, Hindi).
  - Optional photo upload with client-side preview and base64 transmission.
  - Ward dropdown (20 municipal wards) and specific landmark capture.
  - 1-click test scenarios for rapid evaluator demonstration.
  - Generates immutable Complaint ID (`CMP-xxxx`) and Service Ticket ID (`TKT-xxxx`).
  - Preserves original citizen text verbatim.

- **AI Complaint Classification (6 Official Categories)**:
  - `Roads`
  - `Waste`
  - `Water`
  - `Electricity`
  - `Trees`
  - `Drainage`
  - Generates concise summary, language tag, and confidence score.

- **AI Severity Detection (4 Official Tiers)**:
  - `CRITICAL`: Immediate life-safety or electrocution hazard (e.g. exposed live wire near school).
  - `HIGH`: Severe infrastructural disruptions or accident hazards (e.g. crater potholes, burst water mains, fallen trees blocking roads).
  - `MEDIUM`: Hygiene, odor, or community sanitation risks (e.g. overflowing garbage near markets).
  - `LOW`: Minor localized non-hazardous maintenance (e.g. flickering residential streetlight).
  - Generates a mandatory, clear 1-line justification for every assigned severity.

- **Deterministic Department Routing**:
  - Roads → `Road Maintenance Department`
  - Waste → `Solid Waste Management Department`
  - Water → `Water Supply Department`
  - Electricity → `Electrical Department`
  - Trees → `Parks and Horticulture Department`
  - Drainage → `Stormwater Drainage Department`
  - Allows municipal officers to manually override department assignments with recorded audit logs.

- **Officer Priority Dashboard**:
  - Real-time KPI metric cards (Total, Critical, High, Pending, In Progress, Resolved).
  - Strict priority queuing: **CRITICAL → HIGH → MEDIUM → LOW**, then **oldest unresolved complaint first**.
  - Multi-criteria search and filters (Category, Severity, Department, Ward, Status).
  - Deep-dive ticket inspection drawer with historical audit trail and officer notes.

---

### 2. Innovative Features
- **Smart Duplicate Detection**:
  - Groups probable duplicate complaints using text token similarity and spatial/ward proximity.
  - Automatically identifies duplicate reports without silently deleting them, upholding municipal record transparency.
- **Intelligent Risk Scoring (0–100)**:
  - Generates an explainable numerical score factoring in base severity, vulnerable demographic zones (schools, hospitals, markets), and active collision hazards.
  - *Guarantee*: Never overrides the official 4-tier severity hierarchy.
- **Regional Language Processing (Kannada & Hindi)**:
  - Real-time unicode script analysis detects Kannada (`ರಸ್ತೆ`, `ಕಸ`, `ವಿದ್ಯುತ್`) and Hindi input.
  - Preserves original language in complaints while producing normalized English summaries for field technicians.
- **Ward-Level Spatial Intelligence**:
  - Recharts-powered distribution analytics showing incident density, critical urgency hotspots, and resolution rates across wards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts |
| **Backend** | Node.js, Express (ES Modules) |
| **Database** | Persistent JSON Relational Store with ACID-compliant atomic file write (`civiclens_db.json`) |
| **AI Engine** | Dual-Mode Engine: Google Gemini 1.5 Flash API + Built-in Multi-Lingual Civic NLP Engine |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/civiclens.git
cd civiclens

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### Running the Application

#### Option A: Unified Production Server (Recommended)
```bash
# Build the client bundle
npm --prefix client run build

# Start the full-stack server on port 5000
npm --prefix server start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

#### Option B: Development Mode (Hot Reload)
In Terminal 1 (Backend):
```bash
cd server
node --watch index.js
```
In Terminal 2 (Frontend):
```bash
cd client
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Automated Test Suite
To execute the automated regression test covering all 6 mandatory complaint categories, Kannada processing, duplicate detection, and priority sorting:

```bash
node server/test-suite.js
```
Expected output:
```
RESULT: 9/9 TESTS PASSED (100%)
```

---

## 📡 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and AI engine indicator |
| `GET` | `/api/tickets` | Priority-sorted ticket queue with search and filters |
| `GET` | `/api/tickets/:id` | Detailed ticket view with complaint and audit trail |
| `POST` | `/api/complaints` | Citizen submits new complaint for AI triage |
| `POST` | `/api/ai/preview` | Real-time AI classification preview (debounced) |
| `PATCH` | `/api/tickets/:id` | Officer updates status, department, or severity |
| `GET` | `/api/analytics` | High-level metrics, ward rankings, category counts |
| `GET` | `/api/duplicate-groups` | Clustered duplicate incidents |
| `POST` | `/api/seed/reset` | Resets database to default competition seeds |

---

## 👥 Authors & Team
CivicLens Autonomous Engineering Team
- Senior Full-Stack Developer
- AI/ML Engineer
- Backend Architect
- UI/UX Designer
- QA Automation Engineer
- Product Manager
