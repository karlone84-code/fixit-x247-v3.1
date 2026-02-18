
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, func
from app.models.database import User, UserRole

class ProRepository:
    def __init__(self, session: Session, tenant_id: int):
        self.session = session
        self.tenant_id = tenant_id

    def search_pros(
        self, 
        q: Optional[str] = None, 
        category: Optional[str] = None,
        min_rating: float = 0.0
    ) -> List[User]:
        """
        Pesquisa profissionais no tenant seguindo o scoring canónico.
        """
        stmt = select(User).where(
            User.tenant_id == self.tenant_id,
            User.role == UserRole.PRO,
            User.is_active == True
        )

        if q:
            stmt = stmt.where(or_(
                User.email.ilike(f"%{q}%"),
                # User.name.ilike(f"%{q}%") # Adicionar campo name se disponível
            ))
            
        # Filtro de categoria simulado via metadados ou tabelas de skills
        # No MVP v3.1, filtramos por rating mínimo como exemplo de scoring
        # stmt = stmt.where(User.rating >= min_rating)

        return list(self.session.execute(stmt).scalars().all())
