from fastapi import Depends, HTTPException, status
from backend.app.dependencies.auth import get_current_user
from backend.app.models.user import User

PERMISSIONS_MAP = {
    "create_pr": ["Administrator", "Procurement Officer"],
    "approve_pr": ["Manager", "Finance", "Administrator"],
    "manage_vendors": ["Administrator", "Procurement Officer"],
    "edit_policies": ["Administrator"],
    "view_reports": ["Administrator", "Manager", "Finance", "Auditor"]
}

class PermissionChecker:
    def __init__(self, permission_name: str):
        self.permission_name = permission_name

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        allowed_roles = PERMISSIONS_MAP.get(self.permission_name, [])
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: role {current_user.role} lacks permission to {self.permission_name}"
            )
        return current_user
