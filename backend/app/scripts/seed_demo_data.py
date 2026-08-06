import sys
import os
import uuid
import datetime

# Add parent path to import correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal
from backend.app.db.base import Base
from backend.app.models.department import Department
from backend.app.models.vendor import Vendor
from backend.app.models.user import User
from backend.app.models.purchase_request import PurchaseRequest
from backend.app.models.quotation import Quotation
from backend.app.models.approval import Approval
from backend.app.models.purchase_order import PurchaseOrder
from backend.app.models.audit_log import AuditLog
from backend.app.core.security import hash_password

def seed_data():
    db = SessionLocal()
    try:
        # Create all tables first
        Base.metadata.create_all(bind=db.get_bind())
        
        # 1. Clean existing records safely
        db.query(AuditLog).delete()
        db.query(PurchaseOrder).delete()
        db.query(Approval).delete()
        db.query(Quotation).delete()
        db.query(PurchaseRequest).delete()
        db.query(User).delete()
        db.query(Vendor).delete()
        db.query(Department).delete()
        db.commit()

        # 2. Seed 5 Departments
        depts = []
        dept_names = ["Finance", "IT", "HR", "Legal", "Operations"]
        for name in dept_names:
            dept = Department(
                id=str(uuid.uuid4()),
                name=name,
                description=f"{name} Enterprise Operations Division"
            )
            db.add(dept)
            depts.append(dept)
        db.commit()

        # 3. Seed Users
        hashed_pass = hash_password("password123")
        admin_user = User(
            id=str(uuid.uuid4()),
            name="Sarah Jenkins",
            email="sarah.jenkins@procura.io",
            password_hash=hashed_pass,
            role="Administrator",
            is_active=True,
            department_id=depts[0].id
        )
        db.add(admin_user)
        db.commit()

        # 4. Seed 20 Vendors
        vendors = []
        vendor_names = [
            ("Matrix Laptops Corp", "29ABCDE1234F1Z5", 4.8, "ACTIVE"),
            ("GlobalTech Logistics", "27GTECH5678B3Z2", 4.2, "ACTIVE"),
            ("SysLogistics Solutions", "19STAPL9090C4Z4", 4.5, "ACTIVE"),
            ("Office Needs Ltd", "24OFFIC5432A1Z3", 3.8, "ACTIVE"),
            ("A1 Printing Solutions", "18PRIN1234H1Z1", 4.0, "ACTIVE"),
            ("Staples Pro", "27STAPL8888F1Z9", 4.6, "ACTIVE"),
            ("Low Price Stationers", "29LOWPR4321D1Z8", 2.5, "BLACKLISTED"), # Scenario: One rejected vendor
            ("Apex Computers", "12APEXC0001K1Z2", 4.1, "ACTIVE"),
            ("Techno Giants", "27TECHG1111H1Z6", 4.3, "ACTIVE"),
            ("Prime Distribution", "29PRIME9999F1Z0", 3.9, "ACTIVE"),
            ("Reliable Stationers", "18RELI1111D1Z7", 4.4, "ACTIVE"),
            ("Elite Tech Solutions", "24ELITE0001H1Z4", 4.7, "ACTIVE"),
            ("Fast Delivery Movers", "27FASTD2222J1Z2", 3.5, "ACTIVE"),
            ("Supreme Electronics", "29SUPRE7777K1Z4", 4.2, "ACTIVE"),
            ("Quality Printers", "18QUAL18888D1Z9", 3.9, "ACTIVE"),
            ("Eco Paper Ltd", "27ECOPA5555L1Z1", 4.1, "ACTIVE"),
            ("Best Buy Enterprise", "29BESTB6666M1Z2", 4.5, "ACTIVE"),
            ("Digital Lab Supplies", "27DIGIL3333N1Z1", 4.0, "ACTIVE"),
            ("National Furniture", "19NATIO4444O1Z8", 4.2, "ACTIVE"),
            ("General Trading Inc", "24GENER2222P1Z0", 3.6, "ACTIVE")
        ]
        for name, gst, rating, status in vendor_names:
            vendor = Vendor(
                id=str(uuid.uuid4()),
                vendor_name=name,
                email=f"sales@{name.lower().replace(' ', '')}.com",
                phone="+91 99999 88888",
                gst_number=gst,
                address="120 Tech Park Drive, India",
                status=status,
                rating=rating
            )
            db.add(vendor)
            vendors.append(vendor)
        db.commit()

        # 5. Seed 10 Purchase Requests
        prs = []
        pr_scenarios = [
            ("Laptops Refresh 2026", 75000.0, "HIGH", depts[1].id),
            ("Office Chairs Replacement", 15000.0, "MEDIUM", depts[2].id),
            ("Enterprise Router Procurement", 24000.0, "HIGH", depts[1].id),
            ("Marketing Brochures Print", 5000.0, "LOW", depts[4].id),
            ("Audit Consultant Hire", 48000.0, "CRITICAL", depts[0].id),
            ("Server Rack Upgrade", 120000.0, "CRITICAL", depts[1].id), # Scenario: One high-value purchase
            ("Legal Document Templates", 8000.0, "LOW", depts[3].id),
            ("Breakroom Coffee Machine", 2500.0, "LOW", depts[4].id),
            ("Warehouse Packing Tapes", 1500.0, "LOW", depts[4].id),
            ("HR Payroll Software License", 35000.0, "MEDIUM", depts[2].id)
        ]
        for idx, (title, budget, priority, dept_id) in enumerate(pr_scenarios):
            pr = PurchaseRequest(
                id=str(uuid.uuid4()),
                request_number=f"PR-2026-{1000 + idx}",
                title=title,
                description=f"Purchase Request for {title}",
                department_id=dept_id,
                requested_by=admin_user.id,
                budget=budget,
                priority=priority,
                status="UNDER_REVIEW" if idx < 7 else "APPROVED" if idx < 9 else "DRAFT",
                required_date="2026-09-15"
            )
            db.add(pr)
            prs.append(pr)
        db.commit()

        # 6. Seed 30 Quotations
        quotes = []
        for i in range(10):
            # Seed 3 quotes per request to make a comparison possible
            pr = prs[i]
            for j in range(3):
                vendor = vendors[(i * 3 + j) % len(vendors)]
                
                # Setup specific scenarios within quotes
                price = pr.budget * (0.9 + 0.05 * j)
                if i == 0 and j == 2:
                    # Scenario: One policy violation (price > budget)
                    price = pr.budget * 1.2
                
                delivery = 5 + j * 5
                if i == 1 and j == 1:
                    # Scenario: One delayed delivery (delivery days > 30)
                    delivery = 45

                gst_val = vendor.gst_number
                if i == 2 and j == 2:
                    # Scenario: One missing/invalid GST case
                    gst_val = "INVALID_GST_IN"

                quote = Quotation(
                    id=str(uuid.uuid4()),
                    purchase_request_id=pr.id,
                    vendor_id=vendor.id,
                    original_filename=f"{vendor.vendor_name.lower().replace(' ', '_')}_bid.pdf",
                    stored_filename=f"{uuid.uuid4()}.pdf",
                    file_path=f"uploads/quotations/mock_{i}_{j}.pdf",
                    file_type="application/pdf",
                    file_size=102450,
                    upload_status="READY",
                    price=price,
                    currency="USD",
                    warranty=f"{1 + j} Years",
                    delivery_days=delivery,
                    gst_number=gst_val,
                    confidence_score=94.5
                )
                db.add(quote)
                quotes.append(quote)
        db.commit()

        # 7. Seed 15 Approvals
        for i in range(7):
            pr = prs[i]
            app = Approval(
                id=str(uuid.uuid4()),
                purchase_request_id=pr.id,
                approver_id=admin_user.id,
                status="APPROVED" if i < 5 else "REJECTED" if i == 5 else "PENDING",
                comments="Budget allocation approved and vendor compliance validated." if i < 5 else "Rejected due to budget cap violation.",
                approved_at=datetime.datetime.utcnow() if i < 6 else None
            )
            db.add(app)
        db.commit()

        # 8. Seed 10 Purchase Orders
        for i in range(5):
            pr = prs[i]
            vendor = vendors[i % len(vendors)]
            po = PurchaseOrder(
                id=str(uuid.uuid4()),
                purchase_request_id=pr.id,
                vendor_id=vendor.id,
                po_number=f"PO-2026-99{i:02d}",
                status="DISPATCHED" if i < 3 else "DRAFT",
                pdf_path=f"uploads/purchase_orders/PO-2026-99{i:02d}.pdf",
                generated_at=datetime.datetime.utcnow()
            )
            db.add(po)
        db.commit()

        # 9. Log central seed action in Audit
        audit = AuditLog(
            id=str(uuid.uuid4()),
            entity_type="DatabaseSeeder",
            entity_id="ALL",
            action="SEED_DATABASE",
            performed_by="Sarah Jenkins",
            timestamp=datetime.datetime.utcnow(),
            details="Successfully seeded enterprise demo scenarios: 5 departments, 20 vendors, 10 PRs, 30 quotations, 15 approvals, 10 POs."
        )
        db.add(audit)
        db.commit()

        print("Procura database successfully populated with enterprise demonstration scenarios dataset!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
