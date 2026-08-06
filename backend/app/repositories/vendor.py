from typing import List, Tuple
from sqlalchemy.orm import Session
from backend.app.repositories.base import BaseRepository
from backend.app.models.vendor import Vendor

class VendorRepository(BaseRepository[Vendor]):
    def __init__(self):
        super().__init__(Vendor)

    def get_filtered(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 10,
        search: str = "",
        status: str = "",
        sort_by: str = "vendor_name",
        sort_order: str = "asc"
    ) -> Tuple[List[Vendor], int]:
        query = db.query(Vendor)

        if search:
            query = query.filter(Vendor.vendor_name.ilike(f"%{search}%"))
        
        if status:
            query = query.filter(Vendor.status == status)

        # Handle Sorting
        sort_field = getattr(Vendor, sort_by, Vendor.vendor_name)
        if sort_order == "desc":
            query = query.order_by(sort_field.desc())
        else:
            query = query.order_by(sort_field.asc())

        total = query.count()
        results = query.offset(skip).limit(limit).all()
        return results, total

vendor_repo = VendorRepository()
