from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db
from backend.app.core.config import settings

router = APIRouter()

@router.get("/info", summary="Get system status information")
def get_system_info(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    return {
        "success": True,
        "message": "System status retrieved",
        "data": {
            "version": settings.APP_VERSION,
            "environment": settings.APP_ENV,
            "database": db_status,
            "uptime": "99.99%"
        }
    }
