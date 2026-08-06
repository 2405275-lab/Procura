from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.notifications.service import notification_service
from backend.app.schemas.common import StandardResponse

router = APIRouter()

@router.get("", response_model=StandardResponse[list], summary="Get user notification log list")
def list_notifications(user_id: str, db: Session = Depends(get_db)):
    notes = notification_service.get_by_user(db, user_id=user_id)
    serializable = []
    for n in notes:
        serializable.append({
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat()
        })
    return {
        "success": True,
        "message": "Notifications list retrieved",
        "data": serializable
    }

@router.get("/unread-count", response_model=StandardResponse[int], summary="Get unread notification count")
def get_unread_count(user_id: str, db: Session = Depends(get_db)):
    count = notification_service.get_unread_count(db, user_id=user_id)
    return {
        "success": True,
        "message": "Unread count counted",
        "data": count
    }

@router.put("/{id}/read", response_model=StandardResponse[bool], summary="Mark notification as read")
def mark_read(id: str, db: Session = Depends(get_db)):
    success = notification_service.mark_as_read(db, notification_id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification alert not found")
    return {
        "success": True,
        "message": "Notification marked as read successfully",
        "data": True
    }
