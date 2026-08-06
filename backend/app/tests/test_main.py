import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.security import hash_password, verify_password, create_access_token, decode_access_token

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"

def test_system_info_endpoint():
    res = client.get("/api/v1/system/info")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "database" in data["data"]
    assert "version" in data["data"]

def test_password_security_helpers():
    pwd = "mysecurepassword"
    hashed = hash_password(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("wrong", hashed) is False

def test_jwt_token_utilities():
    subject = "USR-9920"
    token = create_access_token(subject)
    assert isinstance(token, str)
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == subject
