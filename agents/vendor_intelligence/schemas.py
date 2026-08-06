from pydantic import BaseModel

class VendorIntelResponseData(BaseModel):
    vendor_score: float
    risk_score: float
    reliability: str
    performance_details: str

class AgentResponse(BaseModel):
    success: bool
    agent: str = "VendorIntelligenceAgent"
    execution_time_ms: float
    confidence: float
    data: VendorIntelResponseData
