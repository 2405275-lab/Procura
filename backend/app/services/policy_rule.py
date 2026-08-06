from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.policy_rule import PolicyRule
from backend.app.repositories.policy_rule import policy_rule_repo
from backend.app.repositories.audit_log import audit_log_repo
from backend.app.schemas.policy_rule import PolicyRuleCreate, PolicyRuleUpdate

class PolicyRuleService:
    def create(self, db: Session, *, obj_in: PolicyRuleCreate, performed_by: str) -> PolicyRule:
        rule = policy_rule_repo.create(db, obj_in=obj_in.dict())
        
        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "PolicyRule",
            "entity_id": rule.id,
            "action": "CREATE",
            "performed_by": performed_by,
            "details": f"Created policy rule: {rule.rule_name} ({rule.rule_type}: {rule.rule_value})"
        })
        return rule

    def get_all(self, db: Session) -> List[PolicyRule]:
        return policy_rule_repo.get_multi(db, limit=1000)

    def get(self, db: Session, id: str) -> Optional[PolicyRule]:
        return policy_rule_repo.get(db, id)

    def update(
        self, db: Session, *, id: str, obj_in: PolicyRuleUpdate, performed_by: str
    ) -> Optional[PolicyRule]:
        rule = policy_rule_repo.get(db, id)
        if not rule:
            return None

        updated_rule = policy_rule_repo.update(db, db_obj=rule, obj_in=obj_in.dict(exclude_unset=True))

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "PolicyRule",
            "entity_id": rule.id,
            "action": "UPDATE",
            "performed_by": performed_by,
            "details": f"Updated policy rule: {rule.rule_name}"
        })
        return updated_rule

    def remove(self, db: Session, *, id: str, performed_by: str) -> Optional[PolicyRule]:
        rule = policy_rule_repo.get(db, id)
        if not rule:
            return None

        policy_rule_repo.remove(db, id=id)

        # Audit
        audit_log_repo.create(db, obj_in={
            "entity_type": "PolicyRule",
            "entity_id": id,
            "action": "DELETE",
            "performed_by": performed_by,
            "details": f"Removed policy rule: {rule.rule_name}"
        })
        return rule

policy_rule_service = PolicyRuleService()
