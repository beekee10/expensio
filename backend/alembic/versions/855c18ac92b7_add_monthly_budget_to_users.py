"""add monthly_budget to users

Revision ID: 855c18ac92b7
Revises: 132aff4bebec
Create Date: 2026-10-08 15:01:43.150082

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '855c18ac92b7'
down_revision: Union[str, Sequence[str], None] = '132aff4bebec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table('users') as batch_op:
        try:
            batch_op.add_column(sa.Column('monthly_budget', sa.Float(), nullable=False, server_default='25000.0'))
        except Exception:
            pass


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('monthly_budget')
