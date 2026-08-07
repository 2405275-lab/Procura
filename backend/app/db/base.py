from backend.app.db.base_class import Base, BaseClass

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
