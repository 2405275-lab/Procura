from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.policy_rule import policy_rule_service
from backend.app.schemas.policy_rule import PolicyRuleCreate, PolicyRuleUpdate, PolicyRuleResponse
from backend.app.schemas.common import StandardResponse

router = APIRouter()

@router.get("", response_model=StandardResponse[List[PolicyRuleResponse]], summary="List policy rules")
def list_policies(db: Session = Depends(get_db)):
    rules = policy_rule_service.get_all(db)
    return {
        "success": True,
        "message": "Policy rules retrieved",
        "data": rules
    }

@router.post("", response_model=StandardResponse[PolicyRuleResponse], summary="Create policy rule")
def create_policy(
    payload: PolicyRuleCreate,
    db: Session = Depends(get_db)
):
    rule = policy_rule_service.create(db, obj_in=payload, performed_by="Sarah Jenkins")
    return {
        "success": True,
        "message": "Policy rule created successfully",
        "data": rule
    }

@router.get("/{id}", response_model=StandardResponse[PolicyRuleResponse], summary="Get policy rule")
def get_policy(id: str, db: Session = Depends(get_db)):
    rule = policy_rule_service.get(db, id)
    if not rule:
        raise HTTPException(status_code=404, detail="Policy rule not found")
    return {
        "success": True,
        "message": "Policy rule retrieved",
        "data": rule
    }

@router.put("/{id}", response_model=StandardResponse[PolicyRuleResponse], summary="Update policy rule")
def update_policy(
    id: str,
    payload: PolicyRuleUpdate,
    db: Session = Depends(get_db)
):
    rule = policy_rule_service.update(db, id=id, obj_in=payload, performed_by="Sarah Jenkins")
    if not rule:
        raise HTTPException(status_code=404, detail="Policy rule not found")
    return {
        "success": True,
        "message": "Policy rule updated successfully",
        "data": rule
    }

@router.delete("/{id}", response_model=StandardResponse[PolicyRuleResponse], summary="Delete policy rule")
def delete_policy(id: str, db: Session = Depends(get_db)):
    rule = policy_rule_service.remove(db, id=id, performed_by="Sarah Jenkins")
    if not rule:
        raise HTTPException(status_code=404, detail="Policy rule not found")
    return {
        "success": True,
        "message": "Policy rule deleted successfully",
        "data": rule
    }
