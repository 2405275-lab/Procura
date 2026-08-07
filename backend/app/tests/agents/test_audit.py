import pytest
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal
from agents.audit.service import audit_agent_service

def test_audit_agent():
    db = SessionLocal()
    try:
        res = audit_agent_service.run(
            db, user="Sarah Jenkins", action="PIPELINE_RUN", details="Test run of audit logging"
        )
        assert res["success"] is True
        assert res["data"]["status"] == "LOGGED"
    finally:
        db.close()
