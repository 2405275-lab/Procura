import random
from datetime import datetime
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from backend.app.models.purchase_request import PurchaseRequest
from backend.app.repositories.purchase_request import purchase_request_repo
from backend.app.repositories.audit_log import audit_log_repo
from backend.app.schemas.purchase_request import PurchaseRequestCreate, PurchaseRequestUpdate

class PurchaseRequestService:
    def create(self, db: Session, *, obj_in: PurchaseRequestCreate, performed_by: str) -> PurchaseRequest:
        # Generate unique request number
        req_num = f"PR-2026-{random.randint(1000, 9999)}"
        
        # Verify budget isn't negative (handled in schema, but double check)
        if obj_in.budget <= 0:
            raise ValueError("Requisition budget must be positive")

        data = obj_in.dict()
        data["request_number"] = req_num
        data["status"] = "DRAFT"

        pr = purchase_request_repo.create(db, obj_in=data)

        # Write audit trail log
        audit_log_repo.create(db, obj_in={
            "entity_type": "PurchaseRequest",
            "entity_id": pr.id,
            "action": "CREATE",
            "performed_by": performed_by,
            "details": f"Created Requisition {req_num} with budget ${pr.budget:,.2f}"
        })
        return pr

    def get_filtered(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 10,
        search: str = "",
        status: str = "",
        priority: str = "",
        department_id: str = "",
        sort_by: str = "request_number",
        sort_order: str = "asc"
    ) -> Tuple[List[PurchaseRequest], int]:
        return purchase_request_repo.get_filtered(
            db,
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            priority=priority,
            department_id=department_id,
            sort_by=sort_by,
            sort_order=sort_order
        )

    def get(self, db: Session, id: str) -> Optional[PurchaseRequest]:
        return purchase_request_repo.get(db, id)

    def update(
        self, db: Session, *, id: str, obj_in: PurchaseRequestUpdate, performed_by: str
    ) -> Optional[PurchaseRequest]:
        pr = purchase_request_repo.get(db, id)
        if not pr:
            return None
            
        old_status = pr.status
        updated_pr = purchase_request_repo.update(db, db_obj=pr, obj_in=obj_in.dict(exclude_unset=True))
        
        # Write audit trail log
        details = f"Updated Requisition. "
        if obj_in.status and obj_in.status != old_status:
            details += f"Status modified from {old_status} to {obj_in.status}."
            
        audit_log_repo.create(db, obj_in={
            "entity_type": "PurchaseRequest",
            "entity_id": pr.id,
            "action": "UPDATE",
            "performed_by": performed_by,
            "details": details
        })
        return updated_pr

    def remove(self, db: Session, *, id: str, performed_by: str) -> Optional[PurchaseRequest]:
        pr = purchase_request_repo.get(db, id)
        if not pr:
            return None
        
        purchase_request_repo.remove(db, id=id)
        
        # Write audit trail log
        audit_log_repo.create(db, obj_in={
            "entity_type": "PurchaseRequest",
            "entity_id": id,
            "action": "DELETE",
            "performed_by": performed_by,
            "details": f"Removed Requisition {pr.request_number} from database."
        })
        return pr

purchase_request_service = PurchaseRequestService()
