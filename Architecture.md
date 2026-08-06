# Procura Platform Architecture

Procura is structured as a modular full-stack web application designed for enterprise procurement auditing.

## Tech Stack Overview

- **Frontend**: React (TypeScript), TailwindCSS, Recharts (visual spend and resource utilization), framer-motion (micro-animations), and Lucide-icons.
- **Backend**: FastAPI (Python), ASGI server (Uvicorn), JWT authorization guards.
- **Database**: SQLAlchemy ORM mapping SQLite (local development file) and PostgreSQL (production instance pools).
- **AI Orchestration**: Custom multi-agent sequencing pipeline.

## Multi-Agent System Diagram

```mermaid
graph TD
    A[Quotation Upload] --> B[OCR Agent]
    B -->|Raw Text| C[Extraction Agent]
    C -->|Structured JSON| D[Policy Agent]
    C -->|Structured JSON| E[Vendor Intelligence Agent]
    D -->|GST / Warranty Checks| F[Compliance exceptions logs]
    E -->|Scored metrics| G[Side-by-side matrices comparison]
    F & G --> H[Director Override / Approval Signature]
    H --> I[Purchase Order Agent]
    I -->|ASCII/PDF| J[PO Synchronization to SAP ERP]
```

## Database Schema Diagram

```mermaid
erDiagram
    USERS {
        string id PK
        string name
        string email
        string role
        string status
    }
    PURCHASE_REQUESTS {
        string id PK
        string title
        float budget
        string priority
        string status
    }
    QUOTATIONS {
        string id PK
        string request_id FK
        string vendor_name
        float price
        string warranty
        int delivery_days
    }
    AUDIT_LOGS {
        string id PK
        string timestamp
        string agent
        string action
        string reason
    }
    PURCHASE_REQUESTS ||--o{ QUOTATIONS : contains
    QUOTATIONS }|--|| VENDORS : references
```
