from sqlalchemy import Column, String, Text, Boolean
from backend.app.db.base_class import Base

class PolicyRule(Base):
    __tablename__ = "policy_rules"

    rule_name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    rule_type = Column(String, nullable=False)   # e.g., Maximum Budget, Minimum Warranty, Mandatory GST
    rule_value = Column(String, nullable=False)  # e.g., 100000, 2 Years, Required
    severity = Column(String, default="Warning", nullable=False)  # Warning, Reject
    is_active = Column(Boolean, default=True, nullable=False)
