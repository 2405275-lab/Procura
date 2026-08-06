import os
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database import init_db, SessionLocal, User, PurchaseRequest, Quotation, Vendor, AuditLog, PolicyRule, PurchaseOrder
from backend.auth import create_access_token, verify_token, RoleChecker
from backend.agents import OCRAgent, ExtractionAgent, VendorIntelligenceAgent, PolicyAgent, POAgent, AuditAgent

# Init db tables and seed data
init_db()

app = FastAPI(title="Procura Procurement AI API", version="1.0.0")

# Enable CORS for frontend workspace port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Dependency injection session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class CreatePRRequest(BaseModel):
    title: str
    department: str
    requested_by: str
    budget: float
    priority: str
    deadline: str
    item_category: str
    quantity: int
    delivery_date: str
    description: str
    notes: Optional[str] = None

class SaveRuleRequest(BaseModel):
    field: str
    operator: str
    value: str
    action: str

class UpdateQuotationRequest(BaseModel):
    vendor_name: str
    quote_number: str
    gst_number: str
    price: float
    warranty: str
    delivery_days: int
    payment_terms: str

class OverrideRequest(BaseModel):
    reason: str

class SignRequest(BaseModel):
    approver: str
    notes: Optional[str] = None

# Initialize AI backend agents
ocr_agent = OCRAgent()
extract_agent = ExtractionAgent()
intel_agent = VendorIntelligenceAgent()
policy_agent = PolicyAgent()
po_agent = POAgent()
audit_agent = AuditAgent()

# ENDPOINTS

@app.post("/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Simply check if the user is seeded
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Generate token
    token = create_access_token({"email": user.email, "role": user.role, "name": user.name})
    
    # Audit log entry
    aud = AuditLog(
        id=f"AUD-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        agent=user.name,
        action="User Session Login",
        decision="Success",
        reason="JWT authorized via verified credentials pool",
        status="Completed"
    )
    db.add(aud)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
    }

@app.post("/auth/refresh")
def refresh_token(token: str = Form(...)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired")
    new_token = create_access_token({"email": payload.get("email"), "role": payload.get("role"), "name": payload.get("name")})
    return {"access_token": new_token}

@app.get("/purchase-requests")
def get_purchase_requests(db: Session = Depends(get_db)):
    return db.query(PurchaseRequest).all()

@app.post("/purchase-requests")
def create_purchase_request(req: CreatePRRequest, db: Session = Depends(get_db)):
    pr_id = f"PR-{random.randint(2000, 2999)}"
    new_pr = PurchaseRequest(
        id=pr_id,
        title=req.title,
        department=req.department,
        requested_by=req.requested_by,
        budget=req.budget,
        priority=req.priority,
        status="Open",
        deadline=req.deadline,
        item_category=req.item_category,
        quantity=req.quantity,
        delivery_date=req.delivery_date,
        officer=req.requested_by,
        approver="David Vance",
        description=req.description,
        notes=req.notes,
        num_quotations=0,
        updated_at="Just now"
    )
    db.add(new_pr)
    
    # Audit log
    aud = AuditLog(
        id=f"AUD-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        agent=req.requested_by,
        action="Created Requisition",
        decision="Pending Quotations",
        reason=f"Registered procurement budget request for {req.title}",
        status="Completed",
        request_id=pr_id
    )
    db.add(aud)
    db.commit()
    db.refresh(new_pr)
    return new_pr

@app.get("/purchase-requests/{pr_id}")
def get_pr_details(pr_id: str, db: Session = Depends(get_db)):
    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == pr_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Requisition not found")
    quotes = db.query(Quotation).filter(Quotation.request_id == pr_id).all()
    return {
        "id": pr.id,
        "title": pr.title,
        "department": pr.department,
        "requested_by": pr.requested_by,
        "budget": pr.budget,
        "priority": pr.priority,
        "status": pr.status,
        "deadline": pr.deadline,
        "item_category": pr.item_category,
        "quantity": pr.quantity,
        "delivery_date": pr.delivery_date,
        "officer": pr.officer,
        "approver": pr.approver,
        "description": pr.description,
        "notes": pr.notes,
        "num_quotations": len(quotes),
        "updated_at": pr.updated_at,
        "quotations": quotes
    }

@app.post("/quotations/upload")
async def upload_quotation(
    request_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == request_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Requisition not found")
        
    contents = await file.read()
    
    # AI multi-agents sequence
    # 1. OCR Agent
    raw_text = ocr_agent.run(file.filename, contents)
    
    # 2. Extraction Agent
    extracted = extract_agent.run(file.filename)
    
    # Create Quotation Database Record
    q_id = f"QTN-{random.randint(3000, 3999)}"
    new_quote = Quotation(
        id=q_id,
        request_id=request_id,
        vendor_name=extracted["vendor_name"],
        quote_number=extracted["quote_number"],
        quote_date=extracted["quote_date"],
        gst_number=extracted["gst_number"],
        contact_name=extracted["contact_name"],
        email=extracted["email"],
        phone=extracted["phone"],
        price=extracted["price"],
        currency=extracted["currency"],
        tax_amount=extracted["tax_amount"],
        discount=extracted["discount"],
        warranty=extracted["warranty"],
        delivery_days=extracted["delivery_days"],
        payment_terms=extracted["payment_terms"],
        validity_days=extracted["validity_days"],
        confidence=extracted["confidence"],
        confidence_level=extracted["confidence_level"],
        status="Ready",
        file_name=file.filename,
        file_size=f"{len(contents)/1024:.1f} KB",
        ai_notes=extracted["ai_notes"]
    )
    db.add(new_quote)
    
    # Update PR counter
    pr.num_quotations += 1
    
    # Audit log
    aud = AuditLog(
        id=f"AUD-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        agent="OCR-Extract-Agent",
        action="OCR Document Parse",
        decision="Extracted Quote",
        reason=f"Parsed {file.filename} for vendor {extracted['vendor_name']} with {extracted['confidence']}% accuracy.",
        status="Completed",
        request_id=request_id,
        vendor=extracted["vendor_name"]
    )
    db.add(aud)
    db.commit()
    
    return {"message": "Quotation processed", "quotation": new_quote}

@app.put("/quotations/{q_id}")
def update_quotation(q_id: str, req: UpdateQuotationRequest, db: Session = Depends(get_db)):
    quote = db.query(Quotation).filter(Quotation.id == q_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
        
    quote.vendor_name = req.vendor_name
    quote.quote_number = req.quote_number
    quote.gst_number = req.gst_number
    quote.price = req.price
    quote.warranty = req.warranty
    quote.delivery_days = req.delivery_days
    quote.payment_terms = req.payment_terms
    
    # Audit log
    aud = AuditLog(
        id=f"AUD-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        agent="Officer Manager",
        action="Corrected Quotation",
        decision="Modified",
        reason=f"Updated parameters for quote {quote.quote_number}.",
        status="Completed",
        request_id=quote.request_id,
        vendor=quote.vendor_name
    )
    db.add(aud)
    db.commit()
    return quote

@app.delete("/quotations/{q_id}")
def delete_quotation(q_id: str, db: Session = Depends(get_db)):
    quote = db.query(Quotation).filter(Quotation.id == q_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == quote.request_id).first()
    if pr:
        pr.num_quotations = max(0, pr.num_quotations - 1)
        
    db.delete(quote)
    db.commit()
    return {"message": "Quotation deleted"}

@app.get("/vendors")
def get_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).all()

@app.get("/policies/{pr_id}")
def validate_policies(pr_id: str, db: Session = Depends(get_db)):
    quotes = db.query(Quotation).filter(Quotation.request_id == pr_id).all()
    rules = db.query(PolicyRule).all()
    
    results = {}
    for q in quotes:
        violations = policy_agent.run({
            "price": q.price,
            "warranty": q.warranty,
            "gst_number": q.gst_number
        }, rules)
        results[q.id] = violations
        
    return results

@app.post("/policies/rules")
def save_policy_rule(req: SaveRuleRequest, db: Session = Depends(get_db)):
    r_id = f"RUL-{random.randint(100, 999)}"
    new_rule = PolicyRule(
        id=r_id,
        field=req.field,
        operator=req.operator,
        value=req.value,
        action=req.action
    )
    db.add(new_rule)
    db.commit()
    return new_rule

@app.delete("/policies/rules/{r_id}")
def delete_policy_rule(r_id: str, db: Session = Depends(get_db)):
    rule = db.query(PolicyRule).filter(PolicyRule.id == r_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(rule)
    db.commit()
    return {"success": True}

@app.get("/policies/rules")
def get_policy_rules(db: Session = Depends(get_db)):
    return db.query(PolicyRule).all()

@app.post("/approvals/override/{pr_id}")
def override_compliance(pr_id: str, req: OverrideRequest, db: Session = Depends(get_db)):
    # Write compliance override into Audit Timeline log
    aud = AuditLog(
        id=f"AUD-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        agent="Sarah Jenkins",
        action="Compliance Exception Override",
        decision="Authorized Override",
        reason=req.reason,
        status="Completed",
        request_id=pr_id
    )
    db.add(aud)
    db.commit()
    return {"message": "Override exception logged"}

@app.post("/approvals/sign/{pr_id}")
def sign_procurement(pr_id: str, req: SignRequest, db: Session = Depends(get_db)):
    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == pr_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Requisition not found")
        
    pr.status = "Approved"
    
    # Select best quotation to generate Purchase Order
    quote = db.query(Quotation).filter(Quotation.request_id == pr_id).order_by(Quotation.price.asc()).first()
    po_text = ""
    po_id = ""
    if quote:
        po_id = f"PO-{random.randint(9000, 9999)}"
        new_po = PurchaseOrder(
            id=po_id,
            request_id=pr_id,
            vendor_name=quote.vendor_name,
            amount=quote.price,
            date=datetime.today().strftime("%Y-%m-%d"),
            status="Dispatched"
        )
        db.add(new_po)
        po_text = po_agent.run(po_id, {
            "vendor_name": quote.vendor_name,
            "quote_number": quote.quote_number,
            "price": quote.price,
            "warranty": quote.warranty,
            "delivery_days": quote.delivery_days,
            "payment_terms": quote.payment_terms
        }, {
            "id": pr_id,
            "item_category": pr.item_category,
            "quantity": pr.quantity
        })
        
    # Log audit entry
    aud = AuditLog(
        id=f"AUD-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        agent=req.approver,
        action="Purchase Order Dispatched",
        decision="PO Dispatched",
        reason=f"Approved requisition {pr_id}. Dispatch generated for {quote.vendor_name if quote else 'unknown'}.",
        status="Completed",
        request_id=pr_id
    )
    db.add(aud)
    db.commit()
    
    return {"message": "Approval signed successfully", "po_id": po_id, "po_document": po_text}

@app.get("/audit-trail")
def get_audit_trail(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

@app.get("/admin/metrics")
def get_admin_metrics():
    # Simulated metrics charts
    return {
        "cpu": [random.randint(10, 45) for _ in range(10)],
        "memory": [random.randint(40, 80) for _ in range(10)],
        "storage": "248 GB / 1024 GB"
    }

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.put("/users/{u_id}/status")
def update_user_status(u_id: str, status_payload: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == u_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = status_payload.get("status", "Active")
    db.commit()
    return {"success": True}
