from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    purchase_request_id = Column(String, ForeignKey("purchase_requests.id"), nullable=False, unique=True, index=True)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False, index=True)
    po_number = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default="DRAFT", nullable=False)  # DRAFT, DISPATCHED, DELIVERED, PAID
    pdf_path = Column(String, nullable=True)
    generated_at = Column(DateTime, nullable=True)

    purchase_request = relationship("PurchaseRequest", back_populates="purchase_order")
    vendor = relationship("Vendor")
