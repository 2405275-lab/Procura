from datetime import datetime
from pydantic import BaseModel

class AuditResponseData(BaseModel):
    audit_id: str
    status: str = "LOGGED"

class AgentResponse(BaseModel):
    success: bool
    agent: str = "AuditAgent"
    execution_time_ms: float
    confidence: float
    data: AuditResponseData
 MuseConfig = {"from_attributes": True}
