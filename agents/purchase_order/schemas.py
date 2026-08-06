from pydantic import BaseModel

class POResponseData(BaseModel):
    po_number: str
    download_url: str
    po_layout_text: str

class AgentResponse(BaseModel):
    success: bool
    agent: str = "PurchaseOrderAgent"
    execution_time_ms: float
    confidence: float
    data: POResponseData
