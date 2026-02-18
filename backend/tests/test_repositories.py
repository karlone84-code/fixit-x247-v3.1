
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base, Tenant, User, UserRole
from app.repositories.user_repository import UserRepository
from app.repositories.bonito_pack_repository import BonitoPackRepository

# Setup DB Test (SQLite in memory)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        # Seed mandatory tenant
        tenant = Tenant(id=1, name="Tenant Test", slug="test-tenant")
        session.add(tenant)
        session.commit()
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

def test_user_repository_isolation(db):
    # 1. Criar utilizadores em tenants diferentes
    # (Simulado, pois o repo força o tenant_id do construtor)
    repo1 = UserRepository(db, tenant_id=1)
    repo2 = UserRepository(db, tenant_id=2) # Tenant 2 não existe no seed, mas testamos a query
    
    u1 = repo1.create(email="user1@x247.pt", password_hash="hash", role=UserRole.CLIENT)
    
    assert u1.tenant_id == 1
    assert len(repo1.list()) == 1
    assert len(repo2.list()) == 0

def test_bonito_pack_repository_structure(db):
    # Teste de esqueleto para garantir contrato
    repo = BonitoPackRepository(db, tenant_id=1)
    assert hasattr(repo, 'list_all')
    assert hasattr(repo, 'session') or hasattr(repo, 'db')
