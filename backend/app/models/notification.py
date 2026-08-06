from sqlalchemy import Column, String, Boolean, ForeignKey
from backend.app.db.base import Base

class Notification(Base):
    __tablename__ = "notifications"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Approval Required, Purchase Approved, etc.
    is_read = Column(Boolean, default=False, nullable=False)
