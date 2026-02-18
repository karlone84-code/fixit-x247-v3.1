from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl, conint, confloat, constr


class BonitoPackStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class BonitoPackCategory(BaseModel):
    area: constr(strip_whitespace=True, min_length=1)
    categoria: constr(strip_whitespace=True, min_length=1)


class BonitoPackBase(BaseModel):
    nome: constr(strip_whitespace=True, min_length=3, max_length=120)
    descricao: constr(strip_whitespace=True, min_length=10, max_length=500)
    preco_base: confloat(gt=0)
    imagem_url: Optional[HttpUrl] = None
    categorias: List[BonitoPackCategory] = Field(min_items=1)
    duracao_minutos: conint(gt=0, le=120) = 120  # <= 2h (Regra Canónica)
    # critérios de elegibilidade
    margem_maxima_pro_percent: confloat(gt=0, le=85.0) = 85.0  # até 85% (Regra Canónica)
    raio_km_sugerido: confloat(gt=0, le=50.0) = 15.0


class BonitoPackCreate(BonitoPackBase):
    pass


class BonitoPackUpdate(BaseModel):
    nome: Optional[constr(strip_whitespace=True, min_length=3, max_length=120)] = None
    descricao: Optional[constr(strip_whitespace=True, min_length=10, max_length=500)] = None
    preco_base: Optional[confloat(gt=0)] = None
    imagem_url: Optional[HttpUrl] = None
    categorias: Optional[List[BonitoPackCategory]] = None
    duracao_minutos: Optional[conint(gt=0, le=120)] = None
    margem_maxima_pro_percent: Optional[confloat(gt=0, le=85.0)] = None
    raio_km_sugerido: Optional[confloat(gt=0, le=50.0)] = None
    status: Optional[BonitoPackStatus] = None


class BonitoPack(BonitoPackBase):
    id: int
    status: BonitoPackStatus = BonitoPackStatus.ACTIVE
    criado_em: datetime
    atualizado_em: datetime

    class Config:
        from_attributes = True
