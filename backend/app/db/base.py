import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import declarative_base, declared_attr

class BaseClass:
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + "s"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

Base = declarative_base(cls=BaseClass)

# Import models so Alembic autogenerate metadata detects them
from backend.app.models.department import Department
from backend.app.models.user import User
from backend.app.models.vendor import Vendor
from backend.app.models.purchase_request import PurchaseRequest
from backend.app.models.quotation import Quotation
from backend.app.models.policy_rule import PolicyRule
from backend.app.models.approval import Approval
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.audit_log import AuditLog
from backend.app.models.notification import Notification
