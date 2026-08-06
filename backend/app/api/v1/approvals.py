from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.approval import approval_service
from backend.app.schemas.approval import ApprovalCreate, ApprovalUpdate, ApprovalResponse
from backend.app.schemas.common import StandardResponse

router = APIRouter()

@router.get("", response_model=StandardResponse[List[ApprovalResponse]], summary="List approvals")
def list_approvals(
    purchase_request_id: str = "",
    db: Session = Depends(get_db)
):
    if purchase_request_id:
        items = approval_service.get_by_request_id(db, purchase_request_id)
    else:
        items = approval_service.get_all(db)
        
    return {
        "success": True,
        "message": "Approvals retrieved successfully",
        "data": items
    }

@router.post("", response_model=StandardResponse[ApprovalResponse], summary="Create approval assignment")
def create_approval(
    payload: ApprovalCreate,
    db: Session = Depends(get_db)
):
    try:
        approval = approval_service.create(db, obj_in=payload, performed_by="Sarah Jenkins")
        return {
            "success": True,
            "message": "Approval assignment created successfully",
            "data": approval
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id}", response_model=StandardResponse[ApprovalResponse], summary="Submit approval sign-off decision")
def update_approval(
    id: str,
    payload: ApprovalUpdate,
    db: Session = Depends(get_db)
):
    approval = approval_service.update(db, id=id, obj_in=payload, performed_by="Sarah Jenkins")
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    return {
        "success": True,
        "message": "Approval decision submitted successfully",
        "data": approval
    }
