from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"

    request_number = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    requested_by = Column(String, ForeignKey("users.id"), nullable=False)
    budget = Column(Float, nullable=False)
    priority = Column(String, default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String, default="DRAFT", nullable=False)      # DRAFT, OPEN, UNDER_REVIEW, APPROVED, REJECTED, CLOSED
    required_date = Column(String, nullable=False)

    department = relationship("Department", back_populates="purchase_requests")
    requester = relationship("User", back_populates="purchase_requests")
    quotations = relationship("Quotation", back_populates="purchase_request", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="purchase_request", cascade="all, delete-orphan")
    purchase_order = relationship("PurchaseOrder", uselist=False, back_populates="purchase_request", cascade="all, delete-orphan")
