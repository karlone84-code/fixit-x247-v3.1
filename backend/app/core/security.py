
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Annotated, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from app.models.database import UserRole

# Configurações de Produção (Regra: Carregar de env)
SECRET_KEY = os.getenv("JWT_SECRET", "x247-kernel-stealth-2026-protocol")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 Semana

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class TokenData(BaseModel):
    user_id: int
    tenant_id: int
    role: UserRole

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_claims(token: Annotated[str, Depends(oauth2_scheme)]) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais X247 inválidas ou expiradas.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        tenant_id: int = payload.get("tenant_id")
        role_str: str = payload.get("role")
        
        if user_id_str is None or tenant_id is None or role_str is None:
            raise credentials_exception
            
        return TokenData(
            user_id=int(user_id_str),
            tenant_id=tenant_id,
            role=UserRole(role_str)
        )
    except (JWTError, ValueError, KeyError):
        raise credentials_exception

# Dep injetável para rotas genéricas
UserClaims = Annotated[TokenData, Depends(get_current_user_claims)]
