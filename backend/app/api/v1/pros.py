
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.core.security import GenericUserClaims, UserClaims
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.repositories.pro_repository import ProRepository

router = APIRouter(prefix="/pros", tags=["professionals"])

@router.get("/search")
def search_professionals(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    user: UserClaims = Depends(GenericUserClaims),
    db: Session = Depends(get_db)
):
    """
    Endpoint real para procura de profissionais por tenant.
    """
    repo = ProRepository(db, user.tenant_id)
    pros = repo.search_pros(q=q, category=category)
    
    # Mapping para o DTO esperado pelo Frontend
    return [
        {
            "id": str(p.id),
            "displayName": p.email.split('@')[0].capitalize(),
            "avatarUrl": None,
            "indicativePrice": 30.00,
            "marketAvgPrice": 45.00,
            "appCommissionPercent": 0.15,
            "totalEstimatedPrice": 34.50,
            "languages": ["pt"],
            "entityType": "INDIVIDUAL",
            "distanceKm": 2.5,
            "averageRating": 4.5,
            "totalReviews": 10,
            "canShowPlanBadge": True,
            "planBadgeLabel": "Verificado",
            "proBudgetFee": 0
        } for p in pros
    ]
