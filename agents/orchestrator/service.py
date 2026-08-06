import time
import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from agents.ocr.service import ocr_agent_service
from agents.extraction.service import extraction_agent_service
from agents.vendor_intelligence.service import vendor_intel_service
from agents.comparison.service import comparison_agent_service
from agents.policy.service import policy_agent_service
from agents.purchase_order.service import purchase_order_agent_service
from agents.audit.service import audit_agent_service

# Global job tracker mapping job_id -> status
JOBS_REGISTRY: Dict[str, Dict[str, Any]] = {}

class AgentOrchestrator:
    def execute_pipeline(
        self,
        db: Session,
        job_id: str,
        filename: str,
        file_bytes: bytes,
        pr_id: str,
        vendor_id: str,
        budget: float = 100000.0
    ):
        JOBS_REGISTRY[job_id] = {
            "status": "PROCESSING",
            "current_agent": "OCRAgent",
            "progress": 10,
            "logs": [],
            "results": {}
        }
        
        start_time = time.time()
        
        try:
            # 1. OCR Agent
            JOBS_REGISTRY[job_id]["current_agent"] = "OCRAgent"
            ocr_res = ocr_agent_service.run(filename, file_bytes)
            JOBS_REGISTRY[job_id]["logs"].append(ocr_res)
            if not ocr_res["success"]:
                raise ValueError(f"OCR failed: {ocr_res.get('error')}")
            
            raw_text = ocr_res["data"]["raw_text"]
            JOBS_REGISTRY[job_id]["progress"] = 30

            # 2. Extraction Agent
            JOBS_REGISTRY[job_id]["current_agent"] = "ExtractionAgent"
            ext_res = extraction_agent_service.run(raw_text)
            JOBS_REGISTRY[job_id]["logs"].append(ext_res)
            if not ext_res["success"]:
                raise ValueError(f"Extraction failed: {ext_res.get('error')}")
                
            quote_data = ext_res["data"]
            JOBS_REGISTRY[job_id]["progress"] = 50

            # 3. Vendor Intelligence Agent
            JOBS_REGISTRY[job_id]["current_agent"] = "VendorIntelligenceAgent"
            intel_res = vendor_intel_service.run(quote_data["gst_number"], rating=4.5)
            JOBS_REGISTRY[job_id]["logs"].append(intel_res)
            
            JOBS_REGISTRY[job_id]["progress"] = 70

            # 4. Comparison Agent
            JOBS_REGISTRY[job_id]["current_agent"] = "ComparisonAgent"
            # Compare quote with itself as singular option list
            comp_res = comparison_agent_service.run([quote_data])
            JOBS_REGISTRY[job_id]["logs"].append(comp_res)
            
            JOBS_REGISTRY[job_id]["progress"] = 80

            # 5. Policy Agent
            JOBS_REGISTRY[job_id]["current_agent"] = "PolicyAgent"
            quote_data["budget"] = budget
            policy_res = policy_agent_service.run(quote_data, [])
            JOBS_REGISTRY[job_id]["logs"].append(policy_res)
            
            JOBS_REGISTRY[job_id]["progress"] = 90

            # 6. Audit Agent
            JOBS_REGISTRY[job_id]["current_agent"] = "AuditAgent"
            audit_res = audit_agent_service.run(
                db,
                user="system",
                action="PIPELINE_COMPLETE",
                details=f"Completed automated multi-agent quotation parse validation for request {pr_id}.",
                pr_id=pr_id
            )
            JOBS_REGISTRY[job_id]["logs"].append(audit_res)

            # Final success state compilation
            total_duration_ms = (time.time() - start_time) * 1000
            
            JOBS_REGISTRY[job_id]["status"] = "SUCCESS"
            JOBS_REGISTRY[job_id]["progress"] = 100
            JOBS_REGISTRY[job_id]["results"] = {
                "extracted_quotation": quote_data,
                "vendor_intelligence": intel_res["data"],
                "comparison": comp_res["data"],
                "compliance": policy_res["data"],
                "total_duration_ms": total_duration_ms
            }

        except Exception as e:
            JOBS_REGISTRY[job_id]["status"] = "FAILED"
            JOBS_REGISTRY[job_id]["results"] = {
                "error": str(e)
            }
            # Audit failure log
            try:
                audit_agent_service.run(
                    db,
                    user="system",
                    action="PIPELINE_FAILURE",
                    details=f"Pipeline aborted: {str(e)}",
                    pr_id=pr_id
                )
            except Exception:
                pass

orchestrator_service = AgentOrchestrator()
