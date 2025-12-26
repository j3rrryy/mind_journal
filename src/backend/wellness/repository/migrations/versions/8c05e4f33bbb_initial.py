"""initial

Revision ID: 8c05e4f33bbb
Revises:
Create Date: 2026-02-07 12:19:00.446024

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "8c05e4f33bbb"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "records",
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("user_id", sa.UUID(as_uuid=False), nullable=False),
        sa.Column("mood", sa.Integer(), nullable=False),
        sa.Column("sleep_hours", sa.Float(), nullable=False),
        sa.Column("activity", sa.Integer(), nullable=False),
        sa.Column("stress", sa.Integer(), nullable=False),
        sa.Column("energy", sa.Integer(), nullable=False),
        sa.Column("focus", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("date", "user_id"),
    )


def downgrade() -> None:
    op.drop_table("records")
