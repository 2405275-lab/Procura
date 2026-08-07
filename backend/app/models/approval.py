from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base

class Approval(Base):
    __tablename__ = "approvals"

    purchase_request_id = Column(String, ForeignKey("purchase_requests.id"), nullable=False, index=True)
    approver_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String, default="PENDING", nullable=False)  # PENDING, APPROVED, REJECTED
    comments = Column(Text, nullable=True)
    approved_at = Column(DateTime, nullable=True)

    purchase_request = relationship("PurchaseRequest", back_populates="approvals")
    approver = relationship("User")
