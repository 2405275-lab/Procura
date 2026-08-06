from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.services.quotation import quotation_service
from backend.app.schemas.quotation import QuotationResponse, QuotationCreate
from backend.app.schemas.common import StandardResponse

router = APIRouter()

@router.post("/upload", response_model=StandardResponse[QuotationResponse], summary="Upload quotation document")
async def upload_quotation(
    purchase_request_id: str = Form(...),
    vendor_id: str = Form(...),
    price: float = Form(...),
    currency: str = Form("USD"),
    warranty: str = Form(...),
    delivery_days: int = Form(...),
    gst_number: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        
        # Save local file
        unique_name, file_path, size = quotation_service.save_uploaded_file(
            file.filename, file.content_type, contents
        )

        # Build payload schema
        payload = QuotationCreate(
            purchase_request_id=purchase_request_id,
            vendor_id=vendor_id,
            original_filename=file.filename,
            stored_filename=unique_name,
            file_path=file_path,
            file_type=file.content_type,
            file_size=size,
            upload_status="READY",
            price=price,
            currency=currency,
            warranty=warranty,
            delivery_days=delivery_days,
            gst_number=gst_number
        )

        quote = quotation_service.create(db, obj_in=payload, performed_by="Sarah Jenkins")
        return {
            "success": True,
            "message": "Quotation file uploaded and metadata registered successfully",
            "data": quote
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File save execution failed: {str(e)}")

@router.get("", response_model=StandardResponse[List[QuotationResponse]], summary="List quotations")
def list_quotations(
    purchase_request_id: str = "",
    db: Session = Depends(get_db)
):
    if purchase_request_id:
        items = quotation_service.get_by_request_id(db, purchase_request_id)
    else:
        items = db.query(QuotationResponse).all()
        
    return {
        "success": True,
        "message": "Quotations retrieved successfully",
        "data": items
    }

@router.get("/{id}", response_model=StandardResponse[QuotationResponse], summary="Get quotation details")
def get_quotation(id: str, db: Session = Depends(get_db)):
    quote = quotation_service.get(db, id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return {
        "success": True,
        "message": "Quotation details retrieved",
        "data": quote
    }

@router.delete("/{id}", response_model=StandardResponse[QuotationResponse], summary="Delete quotation")
def delete_quotation(id: str, db: Session = Depends(get_db)):
    quote = quotation_service.remove(db, id=id, performed_by="Sarah Jenkins")
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return {
        "success": True,
        "message": "Quotation deleted successfully",
        "data": quote
    }
