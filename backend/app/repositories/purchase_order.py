from sqlalchemy.orm import Session
from backend.app.repositories.base import BaseRepository
from backend.app.models.purchase_order import PurchaseOrder

class PurchaseOrderRepository(BaseRepository[PurchaseOrder]):
    def __init__(self):
        super().__init__(PurchaseOrder)

    def get_by_request_id(self, db: Session, pr_id: str) -> PurchaseOrder:
        return db.query(PurchaseOrder).filter(PurchaseOrder.purchase_request_id == pr_id).first()

purchase_order_repo = PurchaseOrderRepository()
