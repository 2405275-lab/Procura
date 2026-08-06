import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.approval import Approval
from backend.app.repositories.approval import approval_repo
from backend.app.repositories.purchase_request import purchase_request_repo
from backend.app.repositories.audit_log import audit_log_repo
from backend.app.schemas.approval import ApprovalCreate, ApprovalUpdate

class ApprovalService:
    def create(self, db: Session, *, obj_in: ApprovalCreate, performed_by: str) -> Approval:
        pr = purchase_request_repo.get(db, obj_in.purchase_request_id)
        if not pr:
            raise ValueError(f"Purchase Request {obj_in.purchase_request_id} not found")

        approval = approval_repo.create(db, obj_in=obj_in.dict())

        # Update PR status to UNDER_REVIEW
        purchase_request_repo.update(db, db_obj=pr, obj_in={"status": "UNDER_REVIEW"})

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "Approval",
            "entity_id": approval.id,
            "action": "CREATE",
            "performed_by": performed_by,
            "details": f"Initiated Approval for Requisition {pr.request_number} assigned to Approver ID {obj_in.approver_id}."
        })
        return approval

    def get_by_request_id(self, db: Session, pr_id: str) -> List[Approval]:
        return approval_repo.get_by_request_id(db, pr_id)

    def get_all(self, db: Session) -> List[Approval]:
        return approval_repo.get_multi(db, limit=1000)

    def get(self, db: Session, id: str) -> Optional[Approval]:
        return approval_repo.get(db, id)

    def update(
        self, db: Session, *, id: str, obj_in: ApprovalUpdate, performed_by: str
    ) -> Optional[Approval]:
        approval = approval_repo.get(db, id)
        if not approval:
            return None

        # Update status
        updated_data = obj_in.dict()
        if obj_in.status in ["APPROVED", "REJECTED"]:
            updated_data["approved_at"] = datetime.datetime.utcnow()

        updated_app = approval_repo.update(db, db_obj=approval, obj_in=updated_data)

        # Sync update back to PurchaseRequest status
        pr = purchase_request_repo.get(db, approval.purchase_request_id)
        if pr:
            if obj_in.status == "APPROVED":
                purchase_request_repo.update(db, db_obj=pr, obj_in={"status": "APPROVED"})
            elif obj_in.status == "REJECTED":
                purchase_request_repo.update(db, db_obj=pr, obj_in={"status": "REJECTED"})

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "Approval",
            "entity_id": approval.id,
            "action": "UPDATE",
            "performed_by": performed_by,
            "details": f"Sign-off decision updated to {obj_in.status}. Comments: {obj_in.comments or 'None'}"
        })
        return updated_app

approval_service = ApprovalService()
