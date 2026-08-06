from typing import List, Tuple
from sqlalchemy.orm import Session
from backend.app.repositories.base import BaseRepository
from backend.app.models.purchase_request import PurchaseRequest

class PurchaseRequestRepository(BaseRepository[PurchaseRequest]):
    def __init__(self):
        super().__init__(PurchaseRequest)

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
        query = db.query(PurchaseRequest)

        if search:
            query = query.filter(
                PurchaseRequest.title.ilike(f"%{search}%") | 
                PurchaseRequest.request_number.ilike(f"%{search}%")
            )
        
        if status:
            query = query.filter(PurchaseRequest.status == status)
            
        if priority:
            query = query.filter(PurchaseRequest.priority == priority)

        if department_id:
            query = query.filter(PurchaseRequest.department_id == department_id)

        # Handle Sorting
        sort_field = getattr(PurchaseRequest, sort_by, PurchaseRequest.request_number)
        if sort_order == "desc":
            query = query.order_by(sort_field.desc())
        else:
            query = query.order_by(sort_field.asc())

        total = query.count()
        results = query.offset(skip).limit(limit).all()
        return results, total

purchase_request_repo = PurchaseRequestRepository()
