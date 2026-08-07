import pytest
from backend.app.db.base import Base
from backend.app.core.database import engine, SessionLocal
from backend.app.models.department import Department

# Ensure eager models imports are registered
import backend.app.models

# Eagerly drop and recreate all tables on test initialization for a clean state
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Seed default test department to satisfy foreign key constraints
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
finally:
    db.close()
