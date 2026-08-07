import pytest
from backend.app.tests.agents.vendor_intelligence.service import vendor_intel_service

def test_vendor_intelligence():
    res = vendor_intel_service.run("29ABCDE1234F1Z5", 4.8)
    assert res["success"] is True
    assert res["data"]["vendor_score"] == 96.0
    assert res["data"]["reliability"] == "Excellent"
