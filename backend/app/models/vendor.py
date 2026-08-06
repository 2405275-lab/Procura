from sqlalchemy import Column, String, Float
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Vendor(Base):
    __tablename__ = "vendors"

    vendor_name = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    gst_number = Column(String, unique=True, nullable=False, index=True)
    address = Column(String, nullable=False)
    website = Column(String, nullable=True)
    status = Column(String, default="ACTIVE", nullable=False)  # ACTIVE, INACTIVE, BLACKLISTED
    rating = Column(Float, default=5.0, nullable=False)

    quotations = relationship("Quotation", back_populates="vendor")
