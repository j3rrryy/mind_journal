from datetime import datetime
from typing import Any
from unittest.mock import AsyncMock, MagicMock

from cashews import Cache
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from dto import base as base_dto
from dto import response as response_dto
from repository import Record, WellnessRepository

TIMESTAMP = datetime.fromisoformat("2000-01-01T00:02:03Z")
USER_ID = "00e51a90-0f94-4ecb-8dd1-399ba409508e"
MOOD = 7
SLEEP_HOURS = 6.5
ACTIVITY = 3
STRESS = 9
ENERGY = 5
FOCUS = 8
ACTION_ITEM_PARAMETERS = {"param1": 2.0, "param2": 1.5}


def create_session() -> AsyncSession:
    return AsyncMock(spec=AsyncSession)


def create_sessionmaker(session) -> async_sessionmaker[AsyncSession]:
    sessionmaker = MagicMock(spec=async_sessionmaker[AsyncSession])
    sessionmaker.return_value.__aenter__.return_value = session
    sessionmaker.begin.return_value.__aenter__.return_value = session
    return sessionmaker


def create_cache() -> Cache:
    return AsyncMock(spec=Cache)


def create_wellness_repository() -> WellnessRepository:
    crud = AsyncMock(spec=WellnessRepository)
    crud.upsert_record = AsyncMock(return_value=None)
    crud.record_list = AsyncMock(
        return_value=(
            [
                response_dto.RecordInfoResponseDTO(
                    TIMESTAMP,
                    base_dto.MetricsDTO(
                        MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS
                    ),
                )
            ]
        )
    )
    crud.delete_all = AsyncMock(return_value=None)
    crud.dashboard = AsyncMock(
        return_value=response_dto.DashboardResponseDTO(
            base_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
            response_dto.WeeklyAveragesResponseDTO(
                MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS, {}
            ),
        )
    )
    crud.get_all_user_ids = AsyncMock(return_value=[USER_ID])
    return crud


def create_record() -> Record:
    return Record(
        date=TIMESTAMP.date(),
        user_id=USER_ID,
        mood=MOOD,
        sleep_hours=SLEEP_HOURS,
        activity=ACTIVITY,
        stress=STRESS,
        energy=ENERGY,
        focus=FOCUS,
    )


def create_dashboard_row() -> Any:
    row = MagicMock()
    row.today_mood = MOOD
    row.today_sleep_hours = SLEEP_HOURS
    row.today_activity = ACTIVITY
    row.today_stress = STRESS
    row.today_energy = ENERGY
    row.today_focus = FOCUS
    row.avg_mood = 6.0
    row.avg_sleep_hours = 7.5
    row.avg_activity = 5.0
    row.avg_stress = 4.0
    row.avg_energy = 5.0
    row.avg_focus = 5.0
    row.prev_mood = 5.0
    row.prev_sleep_hours = 7.0
    row.prev_activity = 4.5
    row.prev_stress = 4.5
    row.prev_energy = 4.5
    row.prev_focus = 4.5
    return row
