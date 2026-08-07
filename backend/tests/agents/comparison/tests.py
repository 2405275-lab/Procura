import pytest
from backend.tests.agents.comparison.service import comparison_agent_service

def test_comparison_ranking():
    quotes = [
        {"vendor_name": "GlobalTech", "price": 64000.0},
        {"vendor_name": "CompSource", "price": 61000.0}
    ]
    res = comparison_agent_service.run(quotes)
    assert res["success"] is True
    assert res["data"]["ranked_vendors"][0]["vendor_name"] == "CompSource"  # Cheaper ranked first
