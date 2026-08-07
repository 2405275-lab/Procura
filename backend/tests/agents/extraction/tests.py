import pytest
from backend.tests.agents.extraction.service import extraction_agent_service

def test_extraction_success():
    res = extraction_agent_service.run("GSTIN: 29ABCDE1234F1Z5\nVendor Name: CompSource Inc.")
    assert res["success"] is True
    assert res["data"]["vendor_name"] == "CompSource Inc."
    assert res["data"]["gst_number"] == "29ABCDE1234F1Z5"
