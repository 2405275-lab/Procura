from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

class ApprovalBase(BaseModel):
    purchase_request_id: str
    approver_id: str
    status: str = "PENDING"  # PENDING, APPROVED, REJECTED
    comments: Optional[str] = None

class ApprovalCreate(ApprovalBase):
    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = ["PENDING", "APPROVED", "REJECTED"]
        if v not in allowed:
            raise ValueError(f"Approval status must be one of: {allowed}")
        return v

class ApprovalUpdate(BaseModel):
    status: str
    comments: Optional[str] = None

class ApprovalResponse(ApprovalBase):
    id: str
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
