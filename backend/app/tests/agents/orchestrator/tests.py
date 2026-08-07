import pytest
from backend.app.core.database import SessionLocal
from backend.app.tests.agents.orchestrator.service import orchestrator_service, JOBS_REGISTRY

def test_orchestrator_pipeline():
    db = SessionLocal()
    try:
        job_id = "test-job-9043"
        orchestrator_service.execute_pipeline(
            db,
            job_id=job_id,
            filename="compsource_bid.pdf",
            file_bytes=b"Sample invoice PDF data bytes stream.",
            pr_id="PR-2041",
            vendor_id="VND-001",
            budget=100000.0
        )
        assert job_id in JOBS_REGISTRY
        assert JOBS_REGISTRY[job_id]["status"] == "SUCCESS"
        assert JOBS_REGISTRY[job_id]["progress"] == 100
        assert "extracted_quotation" in JOBS_REGISTRY[job_id]["results"]
    finally:
        db.close()
