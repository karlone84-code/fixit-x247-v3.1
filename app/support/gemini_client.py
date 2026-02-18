
from __future__ import annotations
from typing import Iterable
from .chat_schemas import ChatTurn

class GeminiClient:
    def __init__(self, api_key: str) -> None:
        self._api_key = api_key

    async def chat(self, message: str, history: Iterable[ChatTurn]) -> str:
        # MVP: Resposta simulada. 
        # Integração real usará @google/genai com gemini-3-flash-preview.
        return f"Olá! Sou o Flix. Recebi a sua mensagem sobre este tema. Como posso ajudar mais no seu 'Bonito Serviço'?"
