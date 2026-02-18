from typing import TypeVar, Generic, Type, List, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from ...app.models.database import Base

T = TypeVar("T", bound=Base)

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: Session, tenant_id: int):
        self.model = model
        self.session = session
        self.tenant_id = tenant_id

    def get(self, id: Any) -> Optional[T]:
        """Obtém entidade filtrando pelo tenant_id do contexto."""
        query = select(self.model).where(
            self.model.id == id,
            self.model.tenant_id == self.tenant_id
        )
        return self.session.execute(query).scalar_one_or_none()

    def list(self) -> List[T]:
        """Lista todas as entidades pertencentes ao tenant."""
        query = select(self.model).where(self.model.tenant_id == self.tenant_id)
        return list(self.session.execute(query).scalars().all())

    def create(self, **kwargs) -> T:
        """Cria nova entidade forçando o tenant_id do contexto."""
        instance = self.model(tenant_id=self.tenant_id, **kwargs)
        self.session.add(instance)
        self.session.commit()
        self.session.refresh(instance)
        return instance

    def update(self, id: Any, **kwargs) -> Optional[T]:
        instance = self.get(id)
        if not instance:
            return None
        for key, value in kwargs.items():
            if hasattr(instance, key) and key != 'tenant_id':
                setattr(instance, key, value)
        self.session.commit()
        self.session.refresh(instance)
        return instance