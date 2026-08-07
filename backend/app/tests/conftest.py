import pytest
from backend.app.db.base import Base
from backend.app.core.database import engine

# Ensure eager models imports are registered
import backend.app.models

# Eagerly create all tables on test initialization
Base.metadata.create_all(bind=engine)
