from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.vendor import vendor_service
from backend.app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from backend.app.schemas.common import StandardResponse, PaginatedData

router = APIRouter()

@router.get("", response_model=StandardResponse[PaginatedData[VendorResponse]], summary="List vendors")
def list_vendors(
    page: int = 1,
    limit: int = 10,
    search: str = "",
    status: str = "",
    sort_by: str = "vendor_name",
    sort_order: str = "asc",
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    items, total = vendor_service.get_filtered(
        db,
        skip=skip,
        limit=limit,
        search=search,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return {
        "success": True,
        "message": "Vendors retrieved successfully",
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit
        }
    }

@router.post("", response_model=StandardResponse[VendorResponse], summary="Create vendor")
def create_vendor(
    payload: VendorCreate,
    db: Session = Depends(get_db)
):
    try:
        vendor = vendor_service.create(db, obj_in=payload, performed_by="Sarah Jenkins")
        return {
            "success": True,
            "message": "Vendor created successfully",
            "data": vendor
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}", response_model=StandardResponse[VendorResponse], summary="Get vendor details")
def get_vendor(id: str, db: Session = Depends(get_db)):
    vendor = vendor_service.get(db, id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {
        "success": True,
        "message": "Vendor details retrieved",
        "data": vendor
    }

@router.put("/{id}", response_model=StandardResponse[VendorResponse], summary="Update vendor")
def update_vendor(
    id: str,
    payload: VendorUpdate,
    db: Session = Depends(get_db)
):
    vendor = vendor_service.update(db, id=id, obj_in=payload, performed_by="Sarah Jenkins")
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {
        "success": True,
        "message": "Vendor updated successfully",
        "data": vendor
    }

@router.delete("/{id}", response_model=StandardResponse[VendorResponse], summary="Delete vendor")
def delete_vendor(id: str, db: Session = Depends(get_db)):
    vendor = vendor_service.remove(db, id=id, performed_by="Sarah Jenkins")
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {
        "success": True,
        "message": "Vendor deleted successfully",
        "data": vendor
    }
