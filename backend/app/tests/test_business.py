import io
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

# Test Data Cache
test_dept_id = "DEPT-01"
test_pr_id = None
test_vendor_id = None
test_policy_id = None
test_approval_id = None

def test_create_purchase_request():
    global test_pr_id
    payload = {
        "title": "Developer workstations refresh 2026",
        "description": "50 units high-performance laptops",
        "department_id": "DEPT-01",
        "requested_by": "Sarah Jenkins",
        "budget": 75000.0,
        "priority": "HIGH",
        "status": "DRAFT",
        "required_date": "2026-09-15"
    }
    res = client.post("/api/v1/purchase-requests", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "id" in data["data"]
    test_pr_id = data["data"]["id"]

def test_create_invalid_budget():
    payload = {
        "title": "Developer workstations refresh 2026",
        "description": "50 units high-performance laptops",
        "department_id": "DEPT-01",
        "requested_by": "Sarah Jenkins",
        "budget": -100.0,  # Negative budget
        "priority": "HIGH",
        "status": "DRAFT",
        "required_date": "2026-09-15"
    }
    res = client.post("/api/v1/purchase-requests", json=payload)
    assert res.status_code == 422  # validation failure

def test_create_vendor():
    global test_vendor_id
    payload = {
        "vendor_name": "Matrix Laptops Corp",
        "email": "sales@matrixlaptops.com",
        "phone": "+91 99999 88888",
        "gst_number": "29ABCDE1234F1Z5",  # Valid mock format
        "address": "120 Whitefield, Bangalore, KA",
        "website": "www.matrixlaptops.com",
        "status": "ACTIVE",
        "rating": 4.5
    }
    res = client.post("/api/v1/vendors", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "id" in data["data"]
    test_vendor_id = data["data"]["id"]

def test_create_invalid_gst():
    payload = {
        "vendor_name": "Broken Laptops Corp",
        "email": "broken@laptops.com",
        "phone": "+91 99999 88888",
        "gst_number": "SHORT_GST",  # Invalid format
        "address": "120 Whitefield, Bangalore, KA",
        "status": "ACTIVE",
        "rating": 3.0
    }
    res = client.post("/api/v1/vendors", json=payload)
    assert res.status_code == 422  # validation failure

def test_upload_quotation_metadata():
    assert test_pr_id is not None
    assert test_vendor_id is not None

    file_content = b"This is a test invoice PDF file content mock."
    file_obj = io.BytesIO(file_content)

    res = client.post(
        "/api/v1/quotations/upload",
        data={
            "purchase_request_id": test_pr_id,
            "vendor_id": test_vendor_id,
            "price": 72500.0,
            "currency": "USD",
            "warranty": "3 Years",
            "delivery_days": 5,
            "gst_number": "29ABCDE1234F1Z5"
        },
        files={"file": ("quotation.pdf", file_obj, "application/pdf")}
    )
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "id" in data["data"]

def test_create_policy_rule():
    global test_policy_id
    payload = {
        "rule_name": "Hard Limit Budget check",
        "description": "Reject bids exceeding request budget cap",
        "rule_type": "Maximum Budget",
        "rule_value": "100000",
        "severity": "Reject",
        "is_active": True
    }
    res = client.post("/api/v1/policies", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    test_policy_id = data["data"]["id"]
