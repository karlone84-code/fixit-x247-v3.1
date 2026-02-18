
"""initial schema

Revision ID: 001
Revises: 
Create Date: 2026-10-01 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Tenants
    op.create_table(
        'tenants',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=50), nullable=False),
        sa.Column('status', sa.Enum('ACTIVE', 'SUSPENDED', 'DELETED', name='tenantstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )

    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('CLIENT', 'PRO', 'ADMIN_ARQUITETO', 'ADMIN_MARKETING', 'ADMIN_OPERACOES_FINANCAS', 'ADMIN_RECURSOS_HUMANOS', 'SUPER_ADMIN', name='userrole'), nullable=False),
        sa.Column('client_plan', sa.Enum('CLIENT_FIX_FREE', 'CLIENT_FIX_PREMIUM', 'BUSINESS_FIX_PREMIUM', name='clientplan'), nullable=True),
        sa.Column('pro_plan', sa.Enum('FIX_PRO_FREE', 'FIX_PRO_PLUS', 'FIX_PRO_ELITE', name='proplan'), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tenant_id', 'email', name='uq_user_email_per_tenant')
    )
    op.create_index('idx_user_tenant_email', 'users', ['tenant_id', 'email'], unique=True)

    # User Permissions
    op.create_table(
        'user_permissions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('permission', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Orders
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('pro_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'MANUAL_FORWARDING', 'PAID', 'ASSIGNED', 'IN_ESCROW', 'COMPLETED', 'DISPUTE', 'CANCELLED', name='orderstatus'), nullable=False),
        sa.Column('amount_cents', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['client_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['pro_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_orders_tenant_client', 'orders', ['tenant_id', 'client_id', 'status'])
    op.create_index('idx_orders_tenant_pro', 'orders', ['tenant_id', 'pro_id', 'status'])

    # Wallet
    op.create_table(
        'wallet_transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('amount_cents', sa.Integer(), nullable=False),
        sa.Column('tx_type', sa.Enum('ESCROW_IN', 'ESCROW_OUT', 'REFUND', 'FEE', name='txtype'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_wallet_tenant_user', 'wallet_transactions', ['tenant_id', 'user_id', 'created_at'])

    # Support
    op.create_table(
        'support_tickets',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('retention_until', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Legal
    op.create_table(
        'legal_documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('version', sa.String(length=20), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('effective_from', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('legal_documents')
    op.drop_table('support_tickets')
    op.drop_table('wallet_transactions')
    op.drop_table('orders')
    op.drop_table('user_permissions')
    op.drop_table('users')
    op.drop_table('tenants')
