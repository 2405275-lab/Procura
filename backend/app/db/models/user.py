from sqlalchemy import Column, String, Boolean
from backend.app.db.base import Base

class User(Base):
    __tablename__ = "users"

    name = Column(String, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Viewer", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
