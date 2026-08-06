from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from backend.app.models.vendor import Vendor
from backend.app.repositories.vendor import vendor_repo
from backend.app.repositories.audit_log import audit_log_repo
from backend.app.schemas.vendor import VendorCreate, VendorUpdate

class VendorService:
    def create(self, db: Session, *, obj_in: VendorCreate, performed_by: str) -> Vendor:
        # Check duplicate GSTIN
        existing_gst = db.query(Vendor).filter(Vendor.gst_number == obj_in.gst_number).first()
        if existing_gst:
            raise ValueError(f"Vendor with GST number {obj_in.gst_number} already exists")

        # Check duplicate name
        existing_name = db.query(Vendor).filter(Vendor.vendor_name == obj_in.vendor_name).first()
        if existing_name:
            raise ValueError(f"Vendor with name {obj_in.vendor_name} already exists")

        vendor = vendor_repo.create(db, obj_in=obj_in.dict())

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "Vendor",
            "entity_id": vendor.id,
            "action": "CREATE",
            "performed_by": performed_by,
            "details": f"Registered Vendor: {vendor.vendor_name} (GST: {vendor.gst_number})"
        })
        return vendor

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
        return vendor_repo.get_filtered(
            db,
            skip=skip,
            limit=limit,
            search=search,
            status=status,
            sort_by=sort_by,
            sort_order=sort_order
        )

    def get(self, db: Session, id: str) -> Optional[Vendor]:
        return vendor_repo.get(db, id)

    def update(
        self, db: Session, *, id: str, obj_in: VendorUpdate, performed_by: str
    ) -> Optional[Vendor]:
        vendor = vendor_repo.get(db, id)
        if not vendor:
            return None

        old_status = vendor.status
        updated_vendor = vendor_repo.update(db, db_obj=vendor, obj_in=obj_in.dict(exclude_unset=True))

        # Audit
        details = f"Updated Vendor details. "
        if obj_in.status and obj_in.status != old_status:
            details += f"Status changed from {old_status} to {obj_in.status}."

        audit_log_repo.create(db, obj_in={
            "entity_type": "Vendor",
            "entity_id": vendor.id,
            "action": "UPDATE",
            "performed_by": performed_by,
            "details": details
        })
        return updated_vendor

    def remove(self, db: Session, *, id: str, performed_by: str) -> Optional[Vendor]:
        vendor = vendor_repo.get(db, id)
        if not vendor:
            return None

        vendor_repo.remove(db, id=id)

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "Vendor",
            "entity_id": id,
            "action": "DELETE",
            "performed_by": performed_by,
            "details": f"Removed Vendor: {vendor.vendor_name}"
        })
        return vendor

vendor_service = VendorService()
