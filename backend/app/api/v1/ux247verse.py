
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import get_current_user_claims, UserClaims, Role
from app.db.session import get_db
from app.models.ux247verse import Ux247Config
from typing import Any, Dict

router = APIRouter(prefix="/ux247verse", tags=["ux247verse"])

def _config_to_dict(cfg: Ux247Config) -> Dict[str, Any]:
    return {
        "videos_enabled": cfg.videos_enabled,
        "hub_enabled": cfg.hub_enabled,
        "social_enabled": cfg.social_enabled,
        "shop_enabled": cfg.shop_enabled,
        "future_enabled": cfg.future_enabled,
        "videos_visibility": cfg.videos_visibility,
        "hub_visibility": cfg.hub_visibility,
        "social_visibility": cfg.social_visibility,
        "shop_visibility": cfg.shop_visibility,
        "future_visibility": cfg.future_visibility,
        "videos_meta": cfg.videos_meta,
        "hub_meta": cfg.hub_meta,
        "social_meta": cfg.social_meta,
        "shop_meta": cfg.shop_meta,
        "future_meta": cfg.future_meta,
    }

@router.get("/config", response_model=dict)
def get_ux247_config(
    user: UserClaims = Depends(get_current_user_claims),
    db: Session = Depends(get_db),
):
    stmt = select(Ux247Config).where(Ux247Config.tenant_id == user.tenant_id)
    cfg = db.execute(stmt).scalar_one_or_none()

    if not cfg:
        # Initial Seed based on Canon v3.1 if missing for tenant
        cfg = Ux247Config(
            tenant_id=user.tenant_id,
            videos_enabled=True,
            hub_enabled=True,
            social_enabled=True,
            shop_enabled=True,
            future_enabled=True,
            videos_meta={
                "pitch_url": "https://www.youtube.com/watch?v=ffFVuYRc3zw",
                "short_url": "https://www.youtube.com/shorts/VQD7dFeGnjo",
                "sos_url": "https://www.youtube.com/watch?v=S2kymv60ndQ"
            },
            hub_meta={
                "stores": {
                    "leroy": "https://www.leroymerlin.pt",
                    "maxmat": "https://www.maxmat.pt",
                    "ikea": "https://www.ikea.com/pt/pt",
                    "amazon": "https://www.amazon.es"
                },
                "jobs": { "linkedin": "https://www.linkedin.com" }
            },
            social_meta={
                "whatsapp_url": "https://chat.whatsapp.com/fixitx247",
                "telegram_url": "https://t.me/fixitx247",
                "facebook_url": "https://facebook.com/fixitx247",
                "instagram_url": "https://instagram.com/fixitx247",
                "tiktok_url": "https://tiktok.com/@fixitx247",
                "x_url": "https://x.com/fixitx247",
                "youtube_url": "https://youtube.com/@fixitx247"
            },
            shop_meta={ "kit_url": "https://fixitx247.pt/shop/kit-pro" },
            future_meta={ "tutoriais": "Em breve", "chat_tv": "Em breve" }
        )
        db.add(cfg)
        db.commit()
        db.refresh(cfg)

    return _config_to_dict(cfg)

@router.put("/config", response_model=dict)
def update_ux247_config(
    payload: Dict[str, Any],
    user: UserClaims = Depends(get_current_user_claims),
    db: Session = Depends(get_db),
):
    if user.role != Role.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas SUPER_ADMIN pode gerir o ecossistema Verse."
        )

    stmt = select(Ux247Config).where(Ux247Config.tenant_id == user.tenant_id)
    cfg = db.execute(stmt).scalar_one_or_none()

    if not cfg:
        cfg = Ux247Config(tenant_id=user.tenant_id)
        db.add(cfg)

    fields = [
        "videos_enabled", "hub_enabled", "social_enabled", "shop_enabled", "future_enabled",
        "videos_visibility", "hub_visibility", "social_visibility", "shop_visibility", "future_visibility",
        "videos_meta", "hub_meta", "social_meta", "shop_meta", "future_meta"
    ]

    for field in fields:
        if field in payload:
            setattr(cfg, field, payload[field])

    db.commit()
    db.refresh(cfg)
    return _config_to_dict(cfg)
