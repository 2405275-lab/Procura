from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from backend.app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    entity_type = Column(String, nullable=False, index=True)  # PurchaseRequest, Vendor, etc.
    entity_id = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)                    # CREATE, UPDATE, DELETE, OVERRIDE
    performed_by = Column(String, nullable=False, index=True)  # User ID or Username
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    details = Column(Text, nullable=True)
