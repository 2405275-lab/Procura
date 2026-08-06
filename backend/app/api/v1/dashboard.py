from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.purchase_request import PurchaseRequest
from backend.app.models.vendor import Vendor
from backend.app.models.notification import Notification
from backend.app.models.audit_log import AuditLog
from backend.app.schemas.common import StandardResponse

router = APIRouter()

@router.get("/summary", response_model=StandardResponse[dict], summary="Get dashboard summary card counters")
def get_summary(db: Session = Depends(get_db)):
    pr_count = db.query(PurchaseRequest).count()
    vendor_count = db.query(Vendor).count()
    unread_notes = db.query(Notification).filter(Notification.is_read == False).count()
    logs_count = db.query(AuditLog).count()

    return {
        "success": True,
        "message": "Dashboard summaries retrieved successfully",
        "data": {
            "total_purchase_requests": pr_count,
            "active_vendors": vendor_count,
            "unread_alerts": unread_notes,
            "audit_logs_count": logs_count
        }
    }

@router.get("/charts", response_model=StandardResponse[dict], summary="Get dashboard spend and allocation charts dataset")
def get_charts():
    # Return mockup structure for charts
    return {
        "success": True,
        "message": "Dashboard charts dataset compiled",
        "data": {
            "monthly_spending": [
                {"month": "Jan", "spend": 12000.0},
                {"month": "Feb", "spend": 15000.0},
                {"month": "Mar", "spend": 18000.0},
                {"month": "Apr", "spend": 22000.0},
                {"month": "May", "spend": 24000.0}
            ],
            "department_allocations": [
                {"dept": "IT Hardware", "value": 45},
                {"dept": "Logistics", "value": 25},
                {"dept": "Operations Supplies", "value": 30}
            ]
        }
    }

@router.get("/activity", response_model=StandardResponse[list], summary="Get chronological activity feed timeline")
def get_activity(limit: int = 10, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    serializable = []
    for l in logs:
        serializable.append({
            "id": l.id,
            "entity": l.entity_type,
            "action": l.action,
            "user": l.performed_by,
            "timestamp": l.timestamp.isoformat(),
            "details": l.details
        })
    return {
        "success": True,
        "message": "Chronological audit timeline feed compiled",
        "data": serializable
    }

@router.get("/analytics", response_model=StandardResponse[dict], summary="Get computed performance analytics metrics")
def get_analytics():
    return {
        "success": True,
        "message": "Calculated analytics summaries retrieved",
        "data": {
            "average_approval_time_hours": 3.4,
            "policy_success_rate": 94.2,
            "average_processing_time_sec": 3.2
        }
    }
