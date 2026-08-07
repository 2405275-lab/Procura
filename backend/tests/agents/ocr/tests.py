import pytest
from backend.tests.agents.ocr.service import ocr_agent_service

def test_ocr_success():
    res = ocr_agent_service.run("quote.pdf", b"Some invoice binary data bytes")
    assert res["success"] is True
    assert res["agent"] == "OCRAgent"
    assert "CompSource" in res["data"]["raw_text"]

def test_ocr_failure_retry():
    res = ocr_agent_service.run("fail_quote.pdf", b"Some blurry binary data bytes")
    assert res["success"] is False
    assert "blurry pixel streams" in res["error"]
