from typing import List

class ApprovalEngine:
    def get_required_approvers(self, budget: float) -> List[str]:
        # Evaluates required signer roles based on budget thresholds
        if budget < 50000.0:
            return ["Manager"]
        else:
            return ["Manager", "Finance"]

    def is_fully_approved(self, budget: float, signed_roles: List[str]) -> bool:
        required = self.get_required_approvers(budget)
        return all(role in signed_roles for role in required)

approval_engine = ApprovalEngine()
