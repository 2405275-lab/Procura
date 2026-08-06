from backend.app.repositories.base import BaseRepository
from backend.app.models.audit_log import AuditLog

class AuditLogRepository(BaseRepository[AuditLog]):
    def __init__(self):
        super().__init__(AuditLog)

audit_log_repo = AuditLogRepository()
