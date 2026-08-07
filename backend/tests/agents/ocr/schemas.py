from pydantic import BaseModel

class OCRResponseData(BaseModel):
    raw_text: str
    confidence: float
    page_count: int

class AgentResponse(BaseModel):
    success: bool
    agent: str = "OCRAgent"
    execution_time_ms: float
    confidence: float
    data: OCRResponseData
