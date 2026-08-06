import os
import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.quotation import Quotation
from backend.app.repositories.quotation import quotation_repo
from backend.app.repositories.purchase_request import purchase_request_repo
from backend.app.repositories.vendor import vendor_repo
from backend.app.repositories.audit_log import audit_log_repo
from backend.app.schemas.quotation import QuotationCreate

UPLOAD_DIR = "uploads/quotations"

class QuotationService:
    def create(self, db: Session, *, obj_in: QuotationCreate, performed_by: str) -> Quotation:
        # Validate PR exists
        pr = purchase_request_repo.get(db, obj_in.purchase_request_id)
        if not pr:
            raise ValueError(f"Purchase Request {obj_in.purchase_request_id} not found")

        # Validate Vendor exists
        vendor = vendor_repo.get(db, obj_in.vendor_id)
        if not vendor:
            raise ValueError(f"Vendor {obj_in.vendor_id} not found")

        # Create record in DB
        quote = quotation_repo.create(db, obj_in=obj_in.dict())

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "Quotation",
            "entity_id": quote.id,
            "action": "CREATE",
            "performed_by": performed_by,
            "details": f"Uploaded quotation metadata for vendor {vendor.vendor_name} (Quote: {quote.stored_filename})"
        })
        return quote

    def save_uploaded_file(self, filename: str, content_type: str, file_bytes: bytes) -> tuple[str, str, int]:
        # Validate format
        allowed_types = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
        if content_type not in allowed_types:
            raise ValueError("Unsupported format type (must be PDF, JPEG, or PNG image)")

        # Validate size (10 MB ceiling)
        size = len(file_bytes)
        if size > 10 * 1024 * 1024:
            raise ValueError("File exceeds 10 MB ceiling threshold")

        os.makedirs(UPLOAD_DIR, exist_ok=True)
        ext = os.path.splitext(filename)[1]
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        return unique_name, file_path, size

    def get_by_request_id(self, db: Session, pr_id: str) -> List[Quotation]:
        return quotation_repo.get_by_request_id(db, pr_id)

    def get(self, db: Session, id: str) -> Optional[Quotation]:
        return quotation_repo.get(db, id)

    def remove(self, db: Session, *, id: str, performed_by: str) -> Optional[Quotation]:
        quote = quotation_repo.get(db, id)
        if not quote:
            return None

        # Try to delete the local file
        if os.path.exists(quote.file_path):
            try:
                os.remove(quote.file_path)
            except Exception:
                pass

        quotation_repo.remove(db, id=id)

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "Quotation",
            "entity_id": id,
            "action": "DELETE",
            "performed_by": performed_by,
            "details": f"Removed quotation: {quote.original_filename}"
        })
        return quote

quotation_service = QuotationService()
