
from enum import Enum
from typing import Annotated, List

from fastapi import Depends, HTTPException, status
from pydantic import BaseModel


class Role(str, Enum):
    CLIENT = "CLIENT"
    PRO = "PRO"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class CurrentUser(BaseModel):
    id: int
    email: str
    role: Role
    is_active: bool = True


def get_current_user() -> CurrentUser:
    """
    Placeholder para integração com o sistema de portas secretas x247.
    Em produção, este valor viria da descodificação de um JWT ou sessão segura.
    """
    return CurrentUser(id=1, email="founder@fixit.x247", role=Role.SUPER_ADMIN)


class RoleChecker:
    def __init__(self, allowed_roles: List[Role]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Utilizador inativo no sistema x247.",
            )
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissão insuficiente para esta porta administrativa.",
            )
        return user


# Aliases para uso simplificado nos endpoints
AdminUser = Annotated[CurrentUser, Depends(RoleChecker([Role.ADMIN, Role.SUPER_ADMIN]))]
SuperAdminUser = Annotated[CurrentUser, Depends(RoleChecker([Role.SUPER_ADMIN]))]
GenericUser = Annotated[CurrentUser, Depends(get_current_user)]
