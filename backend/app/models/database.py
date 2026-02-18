
from datetime import datetime, timezone
import enum
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text, Float, JSON, UniqueConstraint, Index
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

# --- ENUMS CANÓNICOS X247 ---

class TenantStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    DELETED = "DELETED"

class UserRole(str, enum.Enum):
    CLIENT = "CLIENT"
    PRO = "PRO"
    ADMIN_ARQUITETO = "ADMIN_ARQUITETO"
    ADMIN_MARKETING = "ADMIN_MARKETING"
    ADMIN_OPERACOES_FINANCAS = "ADMIN_OPERACOES_FINANCAS"
    ADMIN_RECURSOS_HUMANOS = "ADMIN_RECURSOS_HUMANOS"
    SUPER_ADMIN = "SUPER_ADMIN"

class ClientPlan(str, enum.Enum):
    CLIENT_FIX_FREE = "CLIENT_FIX_FREE"
    CLIENT_FIX_PREMIUM = "CLIENT_FIX_PREMIUM"
    BUSINESS_FIX_PREMIUM = "BUSINESS_FIX_PREMIUM"

class ProPlan(str, enum.Enum):
    FIX_PRO_FREE = "FIX_PRO_FREE"
    FIX_PRO_PLUS = "FIX_PRO_PLUS"
    FIX_PRO_ELITE = "FIX_PRO_ELITE"

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    MANUAL_FORWARDING = "MANUAL_FORWARDING"
    PAID = "PAID"
    ASSIGNED = "ASSIGNED"
    IN_ESCROW = "IN_ESCROW"
    COMPLETED = "COMPLETED"
    DISPUTE = "DISPUTE"
    CANCELLED = "CANCELLED"

class TxType(str, enum.Enum):
    ESCROW_IN = "ESCROW_IN"
    ESCROW_OUT = "ESCROW_OUT"
    REFUND = "REFUND"
    FEE = "FEE"

# --- CORE TABLES ---

class Tenant(Base):
    __tablename__ = "tenants"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    status: Mapped[TenantStatus] = mapped_column(Enum(TenantStatus), default=TenantStatus.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    users = relationship("User", back_populates="tenant")

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)
    email: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    client_plan: Mapped[Optional[ClientPlan]] = mapped_column(Enum(ClientPlan), nullable=True)
    pro_plan: Mapped[Optional[ProPlan]] = mapped_column(Enum(ProPlan), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    tenant = relationship("Tenant", back_populates="users")
    permissions = relationship("UserPermission", back_populates="user")
    
    __table_args__ = (
        UniqueConstraint('tenant_id', 'email', name='uq_user_email_per_tenant'),
        Index('idx_user_tenant_email', 'tenant_id', 'email', unique=True),
    )

class UserPermission(Base):
    __tablename__ = "user_permissions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    permission: Mapped[str] = mapped_column(String(100)) 
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="permissions")

class Order(Base):
    __tablename__ = "orders"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    pro_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.PENDING)
    amount_cents: Mapped[int] = mapped_column(Integer)
    category: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index('idx_orders_tenant_client', 'tenant_id', 'client_id', 'status'),
        Index('idx_orders_tenant_pro', 'tenant_id', 'pro_id', 'status'),
    )

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount_cents: Mapped[int] = mapped_column(Integer)
    tx_type: Mapped[TxType] = mapped_column(Enum(TxType))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index('idx_wallet_tenant_user', 'tenant_id', 'user_id', 'created_at'),
    )

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    category: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(50), default="OPEN")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    retention_until: Mapped[datetime] = mapped_column(DateTime) # Rule: 5 years

class LegalDocument(Base):
    __tablename__ = "legal_documents"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[Optional[int]] = mapped_column(ForeignKey("tenants.id"), nullable=True, index=True)
    type: Mapped[str] = mapped_column(String(50))
    version: Mapped[str] = mapped_column(String(20))
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    effective_from: Mapped[datetime] = mapped_column(DateTime)
