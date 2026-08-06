from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

class QuotationBase(BaseModel):
    purchase_request_id: str
    vendor_id: str
    original_filename: str
    stored_filename: str
    file_path: str
    file_type: str
    file_size: int
    upload_status: str = "READY"
    price: float
    currency: str = "USD"
    warranty: str
    delivery_days: int
    gst_number: str
    confidence_score: Optional[float] = None

class QuotationCreate(QuotationBase):
    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str) -> str:
        allowed = ["USD", "EUR", "INR", "GBP"]
        if v not in allowed:
            raise ValueError(f"Supported currencies: {allowed}")
        return v

    @field_validator("file_size")
    @classmethod
    def validate_file_size(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("File size must exceed zero bytes")
        if v > 10 * 1024 * 1024:  # 10 MB limit
            raise ValueError("File size exceeds 10 MB ceiling threshold")
        return v

    @field_validator("file_type")
    @classmethod
    def validate_file_type(cls, v: str) -> str:
        allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
        if v not in allowed:
            raise ValueError("Unsupported format type (must be PDF or JPEG/PNG image)")
        return v

class QuotationResponse(QuotationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
