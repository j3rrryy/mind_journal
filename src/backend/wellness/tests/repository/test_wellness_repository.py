from unittest.mock import AsyncMock, MagicMock

import pytest
from grpc import StatusCode

from dto import base as base_dto
from dto import request as request_dto
from dto import response as response_dto
from enums import Metric
from exceptions import BaseAppException
from utils import date_to_datetime

from ..mocks import (
    ACTIVITY,
    ENERGY,
    FOCUS,
    MOOD,
    SLEEP_HOURS,
    STRESS,
    TIMESTAMP,
    USER_ID,
)


@pytest.mark.asyncio
async def test_upsert_record(wellness_repository, session):
    dto = request_dto.UpsertRecordRequestDTO(
        USER_ID,
        TIMESTAMP,
        base_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
    )

    await wellness_repository.upsert_record(dto)

    session.merge.assert_awaited_once()


@pytest.mark.asyncio
async def test_upsert_record_exception(session, wellness_repository):
    dto = request_dto.UpsertRecordRequestDTO(
        USER_ID,
        TIMESTAMP,
        base_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
    )
    session.merge.side_effect = Exception("Details")

    with pytest.raises(BaseAppException) as exc_info:
        await wellness_repository.upsert_record(dto)

    assert exc_info.value.status_code == StatusCode.INTERNAL
    assert exc_info.value.details == "Internal database error: Details"
    session.merge.assert_awaited_once()


@pytest.mark.asyncio
async def test_record_list(session, record, wellness_repository):
    session.scalars = AsyncMock(return_value=[record])

    records = await wellness_repository.record_list(
        USER_ID, TIMESTAMP.date(), TIMESTAMP.date()
    )

    assert records == [
        response_dto.RecordInfoResponseDTO(
            date_to_datetime(TIMESTAMP.date()),
            base_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
        )
    ]
    session.scalars.assert_awaited_once()


@pytest.mark.asyncio
async def test_record_list_exception(session, wellness_repository):
    session.scalars.side_effect = Exception("Details")

    with pytest.raises(BaseAppException) as exc_info:
        await wellness_repository.record_list(
            USER_ID, TIMESTAMP.date(), TIMESTAMP.date()
        )

    assert exc_info.value.status_code == StatusCode.INTERNAL
    assert exc_info.value.details == "Internal database error: Details"
    session.scalars.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_all(wellness_repository, session):
    await wellness_repository.delete_all(USER_ID)

    session.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_all_exception(session, wellness_repository):
    session.execute.side_effect = Exception("Details")

    with pytest.raises(BaseAppException) as exc_info:
        await wellness_repository.delete_all(USER_ID)

    assert exc_info.value.status_code == StatusCode.INTERNAL
    assert exc_info.value.details == "Internal database error: Details"
    session.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_dashboard(session, dashboard_row, wellness_repository):
    session.execute = AsyncMock(
        return_value=MagicMock(first=MagicMock(return_value=dashboard_row))
    )

    dashboard = await wellness_repository.dashboard(USER_ID, TIMESTAMP.date())

    assert dashboard == response_dto.DashboardResponseDTO(
        base_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
        response_dto.WeeklyAveragesResponseDTO(
            6.0, 7.5, 5.0, 4.0, 5.0, 5.0, {Metric.MOOD: 1.0}
        ),
    )
    session.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_dashboard_exception(session, wellness_repository):
    session.execute.side_effect = Exception("Details")

    with pytest.raises(BaseAppException) as exc_info:
        await wellness_repository.dashboard(USER_ID, TIMESTAMP.date())

    assert exc_info.value.status_code == StatusCode.INTERNAL
    assert exc_info.value.details == "Internal database error: Details"
    session.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_all_user_ids(session, wellness_repository):
    session.scalars = AsyncMock(return_value=[USER_ID])

    all_user_ids = await wellness_repository.get_all_user_ids()

    assert all_user_ids == [USER_ID]
    session.scalars.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_all_user_ids_exception(session, wellness_repository):
    session.scalars.side_effect = Exception("Details")

    with pytest.raises(BaseAppException) as exc_info:
        await wellness_repository.get_all_user_ids()

    assert exc_info.value.status_code == StatusCode.INTERNAL
    assert exc_info.value.details == "Internal database error: Details"
    session.scalars.assert_awaited_once()
