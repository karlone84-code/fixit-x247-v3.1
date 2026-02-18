
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import AdminUser, GenericUser
from app.domain.legal.models import LegalDocument, LegalDocumentType
from app.domain.legal.repository import legal_repo

router = APIRouter(prefix="/legal", tags=["legal-compliance"])

@router.get("/", response_model=List[LegalDocument])
def list_legal_documents():
    """Lista todos os documentos legais ativos (público)."""
    return legal_repo.list_active()

@router.get("/{doc_type}", response_model=LegalDocument)
def get_legal_document(doc_type: LegalDocumentType):
    """Obtém a versão ativa de um documento legal específico."""
    doc = legal_repo.get_by_type(doc_type)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")
    return doc

@router.post("/", response_model=LegalDocument)
def create_legal_document(payload: LegalDocument, admin: AdminUser):
    """Cria uma nova versão de um documento legal (Admin)."""
    # Desativa versões anteriores do mesmo tipo
    for doc in legal_repo._docs.values():
        if doc.type == payload.type:
            doc.is_active = False
            
    payload.is_active = True
    return legal_repo.create(payload)
