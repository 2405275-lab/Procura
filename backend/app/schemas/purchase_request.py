from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

class PurchaseRequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    department_id: str
    requested_by: str
    budget: float
    priority: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    status: str = "DRAFT"      # DRAFT, OPEN, UNDER_REVIEW, APPROVED, REJECTED, CLOSED
    required_date: str

class PurchaseRequestCreate(PurchaseRequestBase):
    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Budget allocation must exceed zero")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        allowed = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        if v not in allowed:
            raise ValueError(f"Priority level must be one of: {allowed}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = ["DRAFT", "OPEN", "UNDER_REVIEW", "APPROVED", "REJECTED", "CLOSED"]
        if v not in allowed:
            raise ValueError(f"Requisition status must be one of: {allowed}")
        return v

class PurchaseRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[str] = None
    requested_by: Optional[str] = None
    budget: Optional[float] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    required_date: Optional[str] = None

class PurchaseRequestResponse(PurchaseRequestBase):
    id: str
    request_number: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
