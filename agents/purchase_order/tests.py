import pytest
from agents.purchase_order.service import purchase_order_agent_service

def test_po_generation():
    quote = {"vendor_name": "CompSource", "price": 62500.0}
    res = purchase_order_agent_service.run("PR-2026-9920", quote)
    assert res["success"] is True
    assert "PO-2026" in res["data"]["po_number"]
    assert "CompSource" in res["data"]["po_layout_text"]
