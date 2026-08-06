from backend.app.repositories.base import BaseRepository
from backend.app.models.user import User

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

user_repo = UserRepository()
