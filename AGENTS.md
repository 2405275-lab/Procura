# Veridion AI Agent Network

Veridion relies on six specialized, co-operative agents to automate the procurement and quotation validation cycle.

## 1. OCR Agent
- **File**: `backend/agents.py`
- **Responsibility**: Takes raw PDF invoice sheets, JPG invoices, or scanned documents, processes pixel/binary streams, and returns sanitized text payloads.

## 2. Extraction Agent
- **File**: `backend/agents.py`
- **Responsibility**: Accepts raw OCR text streams, extracts target parameters (price totals, tax values, quotation numbers, GSTIN records, warranties, delivery days) and compiles them into a structured JSON map.

## 3. Vendor Intelligence Agent
- **File**: `backend/agents.py`
- **Responsibility**: Computes suitability scores (1-100%) for quotations based on delivery latency penalties, warranty ranges, contract history, and past delivery performance.

## 4. Policy Agent
- **File**: `backend/agents.py`
- **Responsibility**: Checks extracted quotation keys against active rules in the SQL database, raising Exception warnings if requirements (e.g. valid GSTIN, budget compliance) fail.

## 5. Purchase Order Agent
- **File**: `backend/agents.py`
- **Responsibility**: Compiles approved quotation parameters into a professional, ERP-ready Purchase Order document.

## 6. Audit Agent
- **File**: `backend/agents.py`
- **Responsibility**: Intercepts all state changes (requisition creations, OCR updates, overrides, signatures) and registers immutable records in the Audit trail ledger.
