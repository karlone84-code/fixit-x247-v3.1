
from typing import List, Dict, Optional
from .models import LegalDocument, LegalDocumentType

class LegalRepository:
    def __init__(self):
        self._docs: Dict[str, LegalDocument] = {}
        self._counter = 1

    def list_active(self) -> List[LegalDocument]:
        return [doc for doc in self._docs.values() if doc.is_active]

    def get_by_type(self, doc_type: LegalDocumentType) -> Optional[LegalDocument]:
        # Retorna o documento ativo mais recente para aquele tipo
        matches = [doc for doc in self._docs.values() if doc.type == doc_type and doc.is_active]
        if not matches:
            return None
        return sorted(matches, key=lambda x: x.effective_from, reverse=True)[0]

    def create(self, doc: LegalDocument) -> LegalDocument:
        self._docs[doc.id] = doc
        return doc

# Singleton
legal_repo = LegalRepository()
