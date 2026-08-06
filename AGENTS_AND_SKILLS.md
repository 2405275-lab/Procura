# AI Agents and Skills Matrix

This document outlines the interfaces and operations of Procura's Agent Network.

## Operations Matrix

| Agent | Input Channel | Outputs | Target Service |
|---|---|---|---|
| **OCR Agent** | Binary file upload | Sanitized raw text | `OCRAgent.run()` |
| **Extraction Agent** | Raw text stream | Key-value JSON parameters | `ExtractionAgent.run()` |
| **Vendor Intelligence Agent** | Quotation metrics | Weighted ratings score & risk index | `VendorIntelligenceAgent.run()` |
| **Policy Agent** | Extracted fields & database rules | Array of validation status checks | `PolicyAgent.run()` |
| **PO Agent** | Approved quote details | ASCII PO layout document | `POAgent.run()` |
| **Audit Agent** | User, action and timestamp | Immutable audit log record | `AuditAgent.create_log()` |
