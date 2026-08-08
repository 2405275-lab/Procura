# Custom AI Agents and Skills Matrix

This document outlines the architecture, input/output specifications, and file implementation pathways of Procura's custom AI agents and skills.

---

## 1. Custom Agent: PolicyAgent

The **PolicyAgent** is a specialized compliance agent designed to evaluate extracted procurement bids against corporate rule constraints stored in the relational database.

### Implementation Details
- **Source File**: [agents/policy/service.py](file:///C:/CODING/PROJECTS/Procura/agents/policy/service.py)
- **Role Profile**: Compliance Validator
- **Orchestration**: Runs synchronously inside the orchestrator flow or is triggered by API webhooks when raw quotation parameters are generated.

### Input/Output Channels

- **Input Payload (JSON)**:
  ```json
  {
    "price": 62500.0,
    "warranty": "3 Years",
    "delivery_days": 4,
    "gstin": "29ABCDE1234F1Z5"
  }
  ```
- **Output Payload (JSON)**:
  ```json
  {
    "success": true,
    "agent": "PolicyAgent",
    "failures": [
      {
        "rule_id": "POL-001",
        "rule_name": "GST Number Presence Check",
        "severity": "Critical",
        "reason": "Unverified GST number parsed from invoice."
      }
    ]
  }
  ```

---

## 2. Custom Skill: Document OCR & Parameter Extraction

The **OCR Document Extraction Skill** is a custom multi-step pipeline skill that processes scanned raw documents and extracts key procurement parameters.

### Implementation Details
- **Source Files**: 
  - [agents/ocr/service.py](file:///C:/CODING/PROJECTS/Procura/agents/ocr/service.py) (OCR Scan Skill)
  - [agents/extraction/service.py](file:///C:/CODING/PROJECTS/Procura/agents/extraction/service.py) (Text Extraction Skill)
- **Capabilities**:
  - Optical character parsing of unstructured text.
  - LLM-based parameter normalisation (extracting price values, GSTIN strings, warranty years, delivery periods, and supplier metadata).
  - Schema mapping to SQL entities.

### Integration Flow
1. **Trigger**: Requisition officer uploads a quotation file `.png`, `.jpg` or `.pdf`.
2. **Execution**: `OCRAgentService.run()` extracts raw string buffers from the binary stream.
3. **Extraction**: `ExtractionAgentService.run()` converts raw strings into structured JSON.
4. **Validation**: Structured parameters are stored in the relational database and forwarded to the PolicyAgent.
