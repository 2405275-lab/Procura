from typing import List
from sqlalchemy.orm import Session
from backend.app.repositories.base import BaseRepository
from backend.app.models.quotation import Quotation

class QuotationRepository(BaseRepository[Quotation]):
    def __init__(self):
        super().__init__(Quotation)

    def get_by_request_id(self, db: Session, pr_id: str) -> List[Quotation]:
        return db.query(Quotation).filter(Quotation.purchase_request_id == pr_id).all()

quotation_repo = QuotationRepository()
