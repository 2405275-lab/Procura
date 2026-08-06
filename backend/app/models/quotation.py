from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Quotation(Base):
    __tablename__ = "quotations"

    purchase_request_id = Column(String, ForeignKey("purchase_requests.id"), nullable=False, index=True)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False, index=True)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    upload_status = Column(String, default="READY", nullable=False)  # READY, PROCESSING, WAITING
    
    price = Column(Float, nullable=False)
    currency = Column(String, default="USD", nullable=False)
    warranty = Column(String, nullable=False)
    delivery_days = Column(Integer, nullable=False)
    gst_number = Column(String, nullable=False)
    confidence_score = Column(Float, nullable=True)  # Populated later by Extraction Agent

    purchase_request = relationship("PurchaseRequest", back_populates="quotations")
    vendor = relationship("Vendor", back_populates="quotations")
