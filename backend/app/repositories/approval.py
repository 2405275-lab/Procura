from typing import List
from sqlalchemy.orm import Session
from backend.app.repositories.base import BaseRepository
from backend.app.models.approval import Approval

class ApprovalRepository(BaseRepository[Approval]):
    def __init__(self):
        super().__init__(Approval)

    def get_by_request_id(self, db: Session, pr_id: str) -> List[Approval]:
        return db.query(Approval).filter(Approval.purchase_request_id == pr_id).all()

approval_repo = ApprovalRepository()
