
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.app.models.database import User
from .base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, session: Session, tenant_id: int):
        super().__init__(User, session, tenant_id)

    def get_by_email(self, email: str) -> User | None:
        """Busca utilizador por email dentro do tenant."""
        query = select(self.model).where(
            self.model.email == email,
            self.model.tenant_id == self.tenant_id
        )
        return self.session.execute(query).scalar_one_or_none()
