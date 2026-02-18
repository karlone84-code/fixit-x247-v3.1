
"""add orders and wallet

Revision ID: 002
Revises: 001
Create Date: 2026-10-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. Orders Table
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('pro_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'MANUAL_FORWARDING', 'PAID', 'ASSIGNED', 'IN_ESCROW', 'COMPLETED', 'DISPUTE', 'CANCELLED', name='orderstatus'), nullable=False),
        sa.Column('matching_strategy', sa.Enum('AUTO', 'MANUAL_BRIDGE', 'URGENT', name='matchingstrategy'), nullable=False),
        sa.Column('amount_cents', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['client_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['pro_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_orders_tenant_client_status_date', 'orders', ['tenant_id', 'client_id', 'status', 'created_at'])
    op.create_index('idx_orders_tenant_pro_status_date', 'orders', ['tenant_id', 'pro_id', 'status', 'created_at'])

    # 2. Wallet Transactions Table
    op.create_table(
        'wallet_transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('amount_cents', sa.Integer(), nullable=False),
        sa.Column('tx_type', sa.Enum('ESCROW_IN', 'ESCROW_OUT', 'REFUND', 'FEE', name='txtype'), nullable=False),
        sa.Column('model', sa.Enum('INTERNAL', 'BRIDGE', name='txmodel'), nullable=False),
        sa.Column('commission_rate', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_wallet_tenant_user_date', 'wallet_transactions', ['tenant_id', 'user_id', 'created_at'])
    op.create_index('idx_wallet_tenant_order_date', 'wallet_transactions', ['tenant_id', 'order_id', 'created_at'])

def downgrade() -> None:
    op.drop_table('wallet_transactions')
    op.drop_table('orders')
