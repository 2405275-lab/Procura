from typing import Set, Dict

class WorkflowEngine:
    # State Machine definition mapping state -> allowed next states
    TRANSITIONS: Dict[str, Set[str]] = {
        "DRAFT": {"OPEN", "CANCELLED"},
        "OPEN": {"QUOTATIONS_RECEIVED", "UNDER_REVIEW", "CANCELLED"},
        "QUOTATIONS_RECEIVED": {"UNDER_REVIEW", "CANCELLED"},
        "UNDER_REVIEW": {"POLICY_VALIDATED", "REJECTED", "CANCELLED"},
        "POLICY_VALIDATED": {"MANAGER_APPROVED", "REJECTED", "CANCELLED"},
        "MANAGER_APPROVED": {"FINANCE_APPROVED", "PURCHASE_ORDER_GENERATED", "COMPLETED", "CANCELLED"},
        "FINANCE_APPROVED": {"PURCHASE_ORDER_GENERATED", "CANCELLED"},
        "PURCHASE_ORDER_GENERATED": {"COMPLETED", "CANCELLED"},
        "COMPLETED": set(),  # Final state
        "REJECTED": {"DRAFT", "CANCELLED"},
        "CANCELLED": set()   # Final state
    }

    def validate_transition(self, current_state: str, next_state: str) -> bool:
        if current_state not in self.TRANSITIONS:
            return False
        return next_state in self.TRANSITIONS[current_state]

workflow_engine = WorkflowEngine()
