
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class LegalDocumentType(str, Enum):
    TERMS_CLIENT = "TERMS_CLIENT"
    TERMS_PRO = "TERMS_PRO"
    PRIVACY_POLICY = "PRIVACY_POLICY"
    BRIDGE_TERMS = "BRIDGE_TERMS"
    FAQ_LEGAL = "FAQ_LEGAL"

class LegalDocument(BaseModel):
    id: str
    type: LegalDocumentType
    version: str
    language: str = "pt-PT"
    title: str
    content: str
    effective_from: datetime
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LegalDocumentCreate(BaseModel):
    type: LegalDocumentType
    version: str
    title: str
    content: str
    effective_from: datetime
