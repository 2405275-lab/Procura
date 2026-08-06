from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.purchase_request import purchase_request_service
from backend.app.schemas.purchase_request import PurchaseRequestCreate, PurchaseRequestUpdate, PurchaseRequestResponse
from backend.app.schemas.common import StandardResponse, PaginatedData

router = APIRouter()

@router.get("", response_model=StandardResponse[PaginatedData[PurchaseRequestResponse]], summary="List purchase requests")
def list_purchase_requests(
    page: int = 1,
    limit: int = 10,
    search: str = "",
    status: str = "",
    priority: str = "",
    department_id: str = "",
    sort_by: str = "request_number",
    sort_order: str = "asc",
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    items, total = purchase_request_service.get_filtered(
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
    
    return {
        "success": True,
        "message": "Purchase requests retrieved successfully",
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit
        }
    }

@router.post("", response_model=StandardResponse[PurchaseRequestResponse], summary="Create purchase request")
def create_purchase_request(
    payload: PurchaseRequestCreate,
    db: Session = Depends(get_db)
):
    try:
        pr = purchase_request_service.create(db, obj_in=payload, performed_by="Sarah Jenkins")
        return {
            "success": True,
            "message": "Purchase request created successfully",
            "data": pr
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}", response_model=StandardResponse[PurchaseRequestResponse], summary="Get purchase request details")
def get_purchase_request(id: str, db: Session = Depends(get_db)):
    pr = purchase_request_service.get(db, id)
    if not pr:
        raise HTTPException(status_code=404, detail="Purchase request not found")
    return {
        "success": True,
        "message": "Purchase request details retrieved",
        "data": pr
    }

@router.put("/{id}", response_model=StandardResponse[PurchaseRequestResponse], summary="Update purchase request")
def update_purchase_request(
    id: str,
    payload: PurchaseRequestUpdate,
    db: Session = Depends(get_db)
):
    pr = purchase_request_service.update(db, id=id, obj_in=payload, performed_by="Sarah Jenkins")
    if not pr:
        raise HTTPException(status_code=404, detail="Purchase request not found")
    return {
        "success": True,
        "message": "Purchase request updated successfully",
        "data": pr
    }

@router.delete("/{id}", response_model=StandardResponse[PurchaseRequestResponse], summary="Delete purchase request")
def delete_purchase_request(id: str, db: Session = Depends(get_db)):
    pr = purchase_request_service.remove(db, id=id, performed_by="Sarah Jenkins")
    if not pr:
        raise HTTPException(status_code=404, detail="Purchase request not found")
    return {
        "success": True,
        "message": "Purchase request deleted successfully",
        "data": pr
    }
