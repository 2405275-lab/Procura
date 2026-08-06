from typing import Optional, Dict, Any
from pydantic import BaseModel

class ExtractionResponseData(BaseModel):
    vendor_name: str
    gst_number: str
    quote_number: str
    quote_date: str
    price: float
    currency: str = "USD"
    warranty: str
    delivery_days: int
    payment_terms: str
    extracted_fields: Dict[str, Any]

class AgentResponse(BaseModel):
    success: bool
    agent: str = "ExtractionAgent"
    execution_time_ms: float
    confidence: float
    data: ExtractionResponseData
