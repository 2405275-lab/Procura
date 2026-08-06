from backend.app.repositories.base import BaseRepository
from backend.app.models.policy_rule import PolicyRule

class PolicyRuleRepository(BaseRepository[PolicyRule]):
    def __init__(self):
        super().__init__(PolicyRule)

policy_rule_repo = PolicyRuleRepository()
