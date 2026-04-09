import datetime
from unittest.mock import call

import pytest

from dto import base as base_dto
from dto import request as request_dto
from utils import user_dashboard_key, utc_now_naive

from ..mocks import ACTIVITY, ENERGY, FOCUS, MOOD, SLEEP_HOURS, STRESS, USER_ID


@pytest.mark.asyncio
async def test_upsert_record_invalid_code(wellness_service, cache):
    dto = request_dto.UpsertRecordRequestDTO(
        USER_ID,
        utc_now_naive() - datetime.timedelta(days=7),
        base_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
    )

    await wellness_service.upsert_record(dto)

    cache.delete.assert_has_awaits([call(user_dashboard_key(USER_ID))])
