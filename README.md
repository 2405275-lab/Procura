# 🛡️ Procura: B2B Enterprise Procurement Decision Intelligence Platform

🌐 **Live Vercel Demo**: [procura.vercel.app](https://procura-c8iqalowa-404-founder.vercel.app) (Policy Validation Workspace: [procura.vercel.app/policy-validation](https://procura-c8iqalowa-404-founder.vercel.app/policy-validation))

Procura is a B2B Enterprise Procurement Decision Intelligence Platform designed to automate quotation auditing, validate compliance exceptions, compare vendors side-by-side, and coordinate purchase orders using an advanced multi-agent AI architecture.

---

## 🚀 Key Modules & Capabilities

1. **Intelligent Document OCR**: Extracts tabular invoice terms from complex multi-page PDF documents.
2. **Cooperative Multi-Agent Orchestrator**: Executes a workflow pipeline where single-responsibility AI agents (OCR, Extraction, Vendor Intel, Comparison, Policy, PO, Audit) communicate through standard message schemas.
3. **Interactive Comparison Workspaces**: Displays competitive analytics dashboards measuring warranty ranges, delivery timelines, and unit costs side-by-side.
4. **Conditional Sign-off Engine**: Enforces multi-level approval thresholds (e.g. manager signatures for small values, finance sign-off for large values).
5. **Centralized Alerts Inbox**: Feeds unread notification metrics and system state alerts.
6. **Performance Logs Panel**: Tracks latency trends, failure flags, and database connection metrics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (TypeScript), TailwindCSS, Recharts, Framer Motion, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0, Celery, Redis, Pydantic v2, Loguru |
| **Database** | SQLite (Local fallback file) / PostgreSQL (Supabase / Production connection) |
| **Orchestration** | Multi-Agent AI Pipeline, In-Memory Worker, BackgroundTasks |

---

## 📂 Repository Structures

```text
procura/
├── backend/
│   ├── app/
│   │   ├── agents/          # OCR, Extraction, Vendor Intel, Policy, PO, Audit
│   │   │   └── orchestrator/# Pipeline orchestration coordinator
│   │   ├── api/v1/          # Endpoints (Requisitions, Vendors, Jobs, Dashboard)
│   │   ├── core/            # Config parsing, database connection pool, caching
│   │   ├── db/              # SQLAlchemy Base class and meta registrations
│   │   ├── models/          # Database ORM models (PR, Quotation, PO, Notifications)
│   │   ├── schemas/         # Pydantic v2 response schemas and GST validation
│   │   ├── services/        # Decoupled business logic services
│   │   ├── scripts/         # SQL backup/restore and demo seeder scripts
│   │   └── tests/           # Unit, integration, and performance tests
│   ├── main.py              # Application main startup file
│   └── requirements.txt     # Python packages index
└── src/
    ├── layouts/             # Dashboard layouts
    ├── pages/               # Landing, Requisitions, Admin, Users logs
    ├── services/api.ts      # Integrated type-safe Axios client
    └── main.tsx             # Entry node
```

---

## 🏗️ Installation & Setup

### 1. Backend Server Setup
**Requirements**: Python 3.12+ (Strictly compatible and tested on Python 3.12.x)

Create a virtual environment and launch the server:
```bash
# Enter backend folder
cd backend

# Create virtual environment (Python 3.12 compatible)
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Upgrade pip and install Python 3.12 compatible dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# Seed the local SQLite database with mock data scenarios
python app/scripts/seed_demo_data.py

# Start FastAPI server on localhost:8000
uvicorn app.main:app --reload
```

### 2. Frontend Build
Start the Vite dev server locally:
```bash
# Install node packages
npm install

# Run dev server
npm run dev
```

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for details.
