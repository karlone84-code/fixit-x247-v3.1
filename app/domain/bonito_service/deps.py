from .repository import BonitoPackRepository

# Instância única para persistência em memória (Singleton Pattern)
bonito_pack_repository = BonitoPackRepository()


def get_bonito_pack_repository() -> BonitoPackRepository:
    return bonito_pack_repository
