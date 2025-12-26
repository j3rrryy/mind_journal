from datetime import date as dt

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, declarative_base, mapped_column

Base = declarative_base()


class Record(Base):
    __tablename__ = "records"

    date: Mapped[dt] = mapped_column(sa.Date, primary_key=True)
    user_id: Mapped[str] = mapped_column(UUID(False), primary_key=True)
    mood: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    sleep_hours: Mapped[float] = mapped_column(sa.Float, nullable=False)
    activity: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    stress: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    energy: Mapped[int] = mapped_column(sa.Integer, nullable=False)
    focus: Mapped[int] = mapped_column(sa.Integer, nullable=False)
