from typing import List
from sqlalchemy.orm import Session
from backend.app.models.notification import Notification

class NotificationService:
    def create_notification(
        self, db: Session, *, user_id: str, title: str, message: str, notification_type: str
    ) -> Notification:
        note = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            is_read=False
        )
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    def get_by_user(self, db: Session, user_id: str) -> List[Notification]:
        return db.query(Notification).filter(Notification.user_id == user_id).all()

    def get_unread_count(self, db: Session, user_id: str) -> int:
        return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()

    def mark_as_read(self, db: Session, notification_id: str) -> bool:
        note = db.query(Notification).filter(Notification.id == notification_id).first()
        if note:
            note.is_read = True
            db.commit()
            return True
        return False

notification_service = NotificationService()
