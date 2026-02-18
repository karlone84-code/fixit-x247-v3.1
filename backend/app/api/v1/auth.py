
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.database import User, Tenant, UserRole, TenantStatus
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["authentication"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    tenant_name: str = "Espaço Pessoal"

@router.post("/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    # 1. Verificar se user existe
    existing_user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já registado no Ecossistema.")
    
    # 2. Criar Tenant (Regra Multi-tenant: cada novo cliente tem o seu espaço)
    new_tenant = Tenant(
        name=payload.tenant_name,
        slug=payload.email.split('@')[0].lower() + "-space",
        status=TenantStatus.ACTIVE
    )
    db.add(new_tenant)
    db.flush() # Gerar ID do tenant

    # 3. Criar Utilizador
    new_user = User(
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role=UserRole.CLIENT,
        tenant_id=new_tenant.id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    
    return {"status": "success", "user_id": new_user.id, "tenant_id": new_tenant.id}

@router.post("/login")
def login_for_access_token(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou password incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "tenant_id": user.tenant_id,
            "role": user.role.value
        }
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id
        }
    }
