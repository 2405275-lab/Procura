from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AuditLogBase(BaseModel):
    entity_type: str
    entity_id: str
    action: str
    performed_by: str
    details: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True
