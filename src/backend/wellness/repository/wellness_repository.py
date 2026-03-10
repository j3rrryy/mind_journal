import datetime
from typing import Any

from sqlalchemy import delete, select, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from dto import request as request_dto
from dto import response as response_dto
from enums import Metric
from protocols import WellnessRepositoryProtocol
from settings import Settings
from utils import database_exception_handler, get_month_range

from .models import Record


class WellnessRepository(WellnessRepositoryProtocol):
    def __init__(self, sessionmaker: async_sessionmaker[AsyncSession]):
        self._sessionmaker = sessionmaker

    @database_exception_handler
    async def upsert_record(self, data: request_dto.UpsertRecordRequestDTO) -> None:
        new_record = data.to_model(Record)
        async with self._sessionmaker.begin() as session:
            await session.merge(new_record)

    @database_exception_handler
    async def record_list(
        self, data: request_dto.MonthRequestDTO
    ) -> list[response_dto.RecordInfoResponseDTO]:
        start_date, end_date = get_month_range(data.year, data.month)
        async with self._sessionmaker() as session:
            records = await session.scalars(
                select(Record)
                .where(
                    Record.user_id == data.user_id,
                    Record.date >= start_date,
                    Record.date < end_date,
                )
                .order_by(Record.date.asc())
            )
        return [
            response_dto.RecordInfoResponseDTO.from_model(record) for record in records
        ]

    @database_exception_handler
    async def delete_all(self, user_id: str) -> None:
        async with self._sessionmaker.begin() as session:
            await session.execute(delete(Record).where(Record.user_id == user_id))

    @database_exception_handler
    async def dashboard(
        self, user_id: str, client_date: datetime.date
    ) -> response_dto.DashboardResponseDTO:
        query = text(
            """
            SELECT
                MAX(CASE WHEN r.date = :client_date THEN r.mood END) AS today_mood,
                MAX(CASE WHEN r.date = :client_date THEN r.sleep_hours END) AS today_sleep_hours,
                MAX(CASE WHEN r.date = :client_date THEN r.activity END) AS today_activity,
                MAX(CASE WHEN r.date = :client_date THEN r.stress END) AS today_stress,
                MAX(CASE WHEN r.date = :client_date THEN r.energy END) AS today_energy,
                MAX(CASE WHEN r.date = :client_date THEN r.focus END) AS today_focus,

                COALESCE(AVG(CASE WHEN r.date >= :week_start THEN r.mood END), 0) AS avg_mood,
                COALESCE(AVG(CASE WHEN r.date >= :week_start THEN r.sleep_hours END), 0) AS avg_sleep_hours,
                COALESCE(AVG(CASE WHEN r.date >= :week_start THEN r.activity END), 0) AS avg_activity,
                COALESCE(AVG(CASE WHEN r.date >= :week_start THEN r.stress END), 0) AS avg_stress,
                COALESCE(AVG(CASE WHEN r.date >= :week_start THEN r.energy END), 0) AS avg_energy,
                COALESCE(AVG(CASE WHEN r.date >= :week_start THEN r.focus END), 0) AS avg_focus,

                COALESCE(AVG(CASE WHEN r.date >= :prev_week_start AND r.date < :week_start THEN r.mood END), 0) AS prev_mood,
                COALESCE(AVG(CASE WHEN r.date >= :prev_week_start AND r.date < :week_start THEN r.sleep_hours END), 0) AS prev_sleep_hours,
                COALESCE(AVG(CASE WHEN r.date >= :prev_week_start AND r.date < :week_start THEN r.activity END), 0) AS prev_activity,
                COALESCE(AVG(CASE WHEN r.date >= :prev_week_start AND r.date < :week_start THEN r.stress END), 0) AS prev_stress,
                COALESCE(AVG(CASE WHEN r.date >= :prev_week_start AND r.date < :week_start THEN r.energy END), 0) AS prev_energy,
                COALESCE(AVG(CASE WHEN r.date >= :prev_week_start AND r.date < :week_start THEN r.focus END), 0) AS prev_focus
            FROM records r
            WHERE r.user_id = :user_id
              AND r.date >= :prev_week_start
              AND r.date <= :client_date
        """
        )

        week_start = client_date - datetime.timedelta(days=6)
        params = {
            "user_id": user_id,
            "client_date": client_date,
            "week_start": week_start,
            "prev_week_start": week_start - datetime.timedelta(days=7),
        }

        async with self._sessionmaker() as session:
            row: Any = (await session.execute(query, params)).first()

        today = (
            response_dto.MetricsDTO(
                row.today_mood,
                row.today_sleep_hours,
                row.today_activity,
                row.today_stress,
                row.today_energy,
                row.today_focus,
            )
            if row.today_mood is not None
            else None
        )

        metric_pairs = [
            (row.avg_mood, row.prev_mood),
            (row.avg_sleep_hours, row.prev_sleep_hours),
            (row.avg_activity, row.prev_activity),
            (row.avg_stress, row.prev_stress),
            (row.avg_energy, row.prev_energy),
            (row.avg_focus, row.prev_focus),
        ]
        changes = {}
        for metric, (curr, prev) in zip(Metric, metric_pairs):
            change = round(curr - prev, 1)
            if abs(change) > Settings.MINIMUM_SIGNIFICANT_CHANGE:
                changes[metric] = change

        return response_dto.DashboardResponseDTO(
            today,
            response_dto.WeeklyAveragesResponseDTO(
                round(row.avg_mood, 1),
                round(row.avg_sleep_hours, 1),
                round(row.avg_activity, 1),
                round(row.avg_stress, 1),
                round(row.avg_energy, 1),
                round(row.avg_focus, 1),
                changes,
            ),
        )

    async def get_all_user_ids(self) -> list[str]:
        async with self._sessionmaker() as session:
            user_ids = await session.scalars(select(Record.user_id).distinct())
        return list(user_ids)
