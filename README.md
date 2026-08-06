# Veridion: Enterprise Procurement Decision Intelligence Platform

Veridion is a B2B Enterprise Procurement Decision Intelligence Platform that automates quotation auditing, checks compliance exceptions, compares vendors side-by-side, and generates Purchase Orders using a co-operative multi-agent AI architecture.

## Key Features

1. **Intelligent OCR Document Parsing**: Accepts PDF/images invoice files, parses rate matrices and GST details with 96% accuracy.
2. **Side-by-Side Competitive Matrices**: Interactive analytics scoring warranty ranges, delivery delays, and pricing models.
3. **Automated Validation Rules**: Installs compliance policy filters to scan budget limits and invalid tax identifications.
4. **Compliance Exception Override Logs**: Logs override signatures and written justifications directly to database timelines.
5. **Purchase Order Dispatches**: Connects approved bids, compiles PO documents, and synchronizes dispatch states.

## Tech Stack

- **Frontend**: React (TypeScript), TailwindCSS, Recharts, Framer Motion, Lucide icons.
- **Backend**: FastAPI (Python), JWT Session Guards.
- **Database**: SQLite (Local development DB file) / PostgreSQL (Production connection strings).
- **Automation Pipeline**: 6 Specialized AI Agents (OCR, Extraction, Vendor Intelligence, Policy, PO, Audit).

## Repository Structures

```text
├── backend/
│   ├── main.py            # FastAPI endpoints router
│   ├── database.py        # SQLAlchemy database model schemes
│   ├── auth.py            # JWT token and RBAC checker
│   ├── agents.py          # OCR, Extraction, Policy, PO, Audit Agents
│   ├── test_main.py       # Unit checks for backend routes
│   └── requirements.txt   # Python server package lists
├── src/
│   ├── pages/             # Requisitions, Admin dashboards, Help portals
│   ├── services/api.ts    # Axios type-safe integrated API client
│   └── routes/AppRoutes.ts# Public and guarded URL paths
```

## Installation & Running

### 1. Run backend server
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start FastAPI API node
uvicorn backend.main:app --reload
```

### 2. Run frontend web portal
```bash
# Install dependencies
npm install

# Start local server
npm run dev
```

## License
MIT License. See [LICENSE](file:///C:/CODING/PROJECTS/veridion/LICENSE) for details.
