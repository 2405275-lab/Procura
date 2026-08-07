from typing import List
from pydantic import BaseModel

class PolicyViolation(BaseModel):
    rule: str
    expected: str
    actual: str
    status: str = "FAILED"
    reason: str

class PolicyResponseData(BaseModel):
    is_compliant: bool
    violations: List[PolicyViolation]

class AgentResponse(BaseModel):
    success: bool
    agent: str = "PolicyAgent"
    execution_time_ms: float
    confidence: float
    data: PolicyResponseData
