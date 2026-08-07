import pytest
from backend.app.db.base import Base
from backend.app.core.database import engine, SessionLocal
from backend.app.models.department import Department
from backend.app.models.user import User

# Ensure eager models imports are registered
import backend.app.models

# Eagerly drop and recreate all tables on test initialization for a clean state
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Seed default test department and user to satisfy foreign key constraints
db = SessionLocal()
try:
    dept = db.query(Department).filter(Department.id == "DEPT-01").first()
    if not dept:
        dept = Department(
            id="DEPT-01",
            name="Engineering",
            description="Default test engineering department"
        )
        db.add(dept)
        db.commit()

    user = db.query(User).filter(User.id == "Sarah Jenkins").first()
    if not user:
        user = User(
            id="Sarah Jenkins",
            name="Sarah Jenkins",
            email="sarah.jenkins@company.com",
            password_hash="mock_hash",
            role="Procurement Officer",
            department_id="DEPT-01"
        )
        db.add(user)
        db.commit()
finally:
    db.close()
