from typing import List, Dict, Any
from pydantic import BaseModel

class ComparisonItem(BaseModel):
    vendor_name: str
    overall_score: float
    rank: int
    reasoning: str

class ComparisonResponseData(BaseModel):
    ranked_vendors: List[ComparisonItem]
    explanation: str

class AgentResponse(BaseModel):
    success: bool
    agent: str = "ComparisonAgent"
    execution_time_ms: float
    confidence: float
    data: ComparisonResponseData
