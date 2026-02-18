import os
from google import genai
from typing import List, Dict, Any

class GeminiBackendClient:
    """
    Motor de IA Centralizado Fix.it x247 v3.1.
    Implementação assíncrona para alta performance no Kernel.
    """
    def __init__(self):
        # Suporte a ambas as variáveis por redundância
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
        if not self.api_key:
            print("[SENTINEL WARNING] Gemini API_KEY não encontrada. Modo simulação ativo.")
            self.api_key = "STUB_KEY"
        
        self.client = genai.Client(api_key=self.api_key)
        self.model_id = 'gemini-3-flash-preview'

    async def chat(self, prompt: str, history: List[Dict[str, str]], system_instruction: str) -> str:
        """
        Executa interação de chat assíncrona com o Gemini.
        """
        if self.api_key == "STUB_KEY":
            return "Kernel Offline: Configure a GEMINI_API_KEY para ativar o Flix real. Bonito Serviço!"

        chat_contents = []
        
        # Histórico formatado para o SDK (model/user)
        for turn in history[-10:]:
            role = "user" if turn.get("role") == "user" else "model"
            content = turn.get("text") or turn.get("content", "")
            chat_contents.append({"role": role, "parts": [{"text": content}]})
        
        # Adiciona a entrada atual
        chat_contents.append({"role": "user", "parts": [{"text": prompt}]})

        try:
            # Uso da API Assíncrona para não bloquear o Kernel FastAPI
            response = await self.client.aio.models.generate_content(
                model=self.model_id,
                contents=chat_contents,
                config={
                    "system_instruction": system_instruction,
                    "temperature": 0.25, # Maior precisão técnica
                    "max_output_tokens": 120 # Respostas curtas (Canon v3.1)
                }
            )
            return response.text.strip()
        except Exception as e:
            print(f"[X247 AI ERROR] {str(e)}")
            return "Conexão instável com o Kernel IA. Use o WhatsApp: 937 321 338. Bonito Serviço."

# Singleton para reuso de conexão
gemini_engine = GeminiBackendClient()