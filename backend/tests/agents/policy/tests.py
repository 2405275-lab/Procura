import pytest
from backend.tests.agents.policy.service import policy_agent_service

def test_policy_compliance_pass():
    quote = {"price": 50000.0, "gst_number": "29ABCDE1234F1Z5"}
    res = policy_agent_service.run(quote, [])
    assert res["success"] is True
    assert res["data"]["is_compliant"] is True
    assert len(res["data"]["violations"]) == 0

def test_policy_compliance_fail():
    quote = {"price": 120000.0, "gst_number": "INVALID_GST_IN"}
    res = policy_agent_service.run(quote, [])
    assert res["success"] is True
    assert res["data"]["is_compliant"] is False
    assert len(res["data"]["violations"]) == 2  # Budget exceeded and GST invalid
