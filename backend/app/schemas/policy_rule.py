from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class PolicyRuleBase(BaseModel):
    rule_name: str
    description: Optional[str] = None
    rule_type: str
    rule_value: str
    severity: str = "Warning"
    is_active: bool = True

class PolicyRuleCreate(PolicyRuleBase):
    pass

class PolicyRuleUpdate(BaseModel):
    rule_name: Optional[str] = None
    description: Optional[str] = None
    rule_type: Optional[str] = None
    rule_value: Optional[str] = None
    severity: Optional[str] = None
    is_active: Optional[bool] = None

class PolicyRuleResponse(PolicyRuleBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
