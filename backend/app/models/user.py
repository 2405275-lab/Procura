from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    name = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Viewer", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)

    department = relationship("Department", back_populates="users")
    purchase_requests = relationship("PurchaseRequest", back_populates="requester")
