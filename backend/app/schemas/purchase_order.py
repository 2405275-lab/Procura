from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class PurchaseOrderBase(BaseModel):
    purchase_request_id: str
    vendor_id: str
    po_number: str
    status: str = "DRAFT"
    pdf_path: Optional[str] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    pass

class PurchaseOrderResponse(PurchaseOrderBase):
    id: str
    generated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        protected_namespaces = ()
