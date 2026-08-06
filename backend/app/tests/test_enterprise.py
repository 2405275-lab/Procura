import pytest
from backend.app.workflow.service import workflow_engine
from backend.app.approval.service import approval_engine
from backend.app.security.rbac import PERMISSIONS_MAP

def test_workflow_state_transitions():
    # Valid transitions
    assert workflow_engine.validate_transition("DRAFT", "OPEN") is True
    assert workflow_engine.validate_transition("OPEN", "UNDER_REVIEW") is True
    assert workflow_engine.validate_transition("UNDER_REVIEW", "POLICY_VALIDATED") is True
    assert workflow_engine.validate_transition("POLICY_VALIDATED", "MANAGER_APPROVED") is True

    # Invalid transitions
    assert workflow_engine.validate_transition("COMPLETED", "DRAFT") is False
    assert workflow_engine.validate_transition("CANCELLED", "OPEN") is False
    assert workflow_engine.validate_transition("DRAFT", "COMPLETED") is False

def test_approval_levels_thresholds():
    # Budget < 50,000 => Manager only
    reqs_small = approval_engine.get_required_approvers(45000.0)
    assert len(reqs_small) == 1
    assert "Manager" in reqs_small
    assert "Finance" not in reqs_small

    # Budget >= 50,000 => Manager + Finance
    reqs_large = approval_engine.get_required_approvers(75000.0)
    assert len(reqs_large) == 2
    assert "Manager" in reqs_large
    assert "Finance" in reqs_large

    # Test approval state checks
    assert approval_engine.is_fully_approved(45000.0, ["Manager"]) is True
    assert approval_engine.is_fully_approved(75000.0, ["Manager"]) is False
    assert approval_engine.is_fully_approved(75000.0, ["Manager", "Finance"]) is True

def test_rbac_permissions_map():
    assert "create_pr" in PERMISSIONS_MAP
    assert "Administrator" in PERMISSIONS_MAP["create_pr"]
    assert "Procurement Officer" in PERMISSIONS_MAP["create_pr"]
    
    assert "edit_policies" in PERMISSIONS_MAP
    assert "Administrator" in PERMISSIONS_MAP["edit_policies"]
    assert "Viewer" not in PERMISSIONS_MAP["edit_policies"]
