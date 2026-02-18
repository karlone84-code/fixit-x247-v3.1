
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, JSON, ForeignKey
from .database import Base

class Ux247Config(Base):
    __tablename__ = "ux247_configs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True, unique=True)

    # Flags de ativação por aba
    videos_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    hub_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    social_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    shop_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    future_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    # Níveis de visibilidade (public | admin)
    videos_visibility: Mapped[str] = mapped_column(String(16), default="public")
    hub_visibility: Mapped[str] = mapped_column(String(16), default="public")
    social_visibility: Mapped[str] = mapped_column(String(16), default="public")
    shop_visibility: Mapped[str] = mapped_column(String(16), default="public")
    future_visibility: Mapped[str] = mapped_column(String(16), default="admin")

    # Metadados JSON (URLs, Feeds, Atalhos)
    videos_meta: Mapped[dict] = mapped_column(JSON, default=dict)
    hub_meta: Mapped[dict] = mapped_column(JSON, default=dict)
    social_meta: Mapped[dict] = mapped_column(JSON, default=dict)
    shop_meta: Mapped[dict] = mapped_column(JSON, default=dict)
    future_meta: Mapped[dict] = mapped_column(JSON, default=dict)
