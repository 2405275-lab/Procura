from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from backend.app.db.base import Base

class Department(Base):
    __tablename__ = "departments"

    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    users = relationship("User", back_populates="department")
    purchase_requests = relationship("PurchaseRequest", back_populates="department")
