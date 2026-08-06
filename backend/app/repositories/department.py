from backend.app.repositories.base import BaseRepository
from backend.app.models.department import Department

class DepartmentRepository(BaseRepository[Department]):
    def __init__(self):
        super().__init__(Department)

department_repo = DepartmentRepository()
