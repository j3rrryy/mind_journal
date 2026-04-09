from unittest.mock import MagicMock

import pytest
from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp

from dto import response as response_dto
from enums import Insight, Period, Priority, Recommendation
from proto import wellness_pb2 as pb2

from ..mocks import (
    ACTION_ITEM_PARAMETERS,
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
async def test_upsert_record(wellness_controller):
    request = pb2.UpsertRecordRequest(
        user_id=USER_ID,
        date=Timestamp(seconds=int(TIMESTAMP.timestamp())),
        metrics=pb2.Metrics(
            mood=MOOD,
            sleep_hours=SLEEP_HOURS,
            activity=ACTIVITY,
            stress=STRESS,
            energy=ENERGY,
            focus=FOCUS,
        ),
    )

    response = await wellness_controller.UpsertRecord(request, MagicMock())

    assert response == Empty()


@pytest.mark.asyncio
async def test_record_list(cache, mocked_wellness_repository, wellness_controller):
    cache.get.return_value = mocked_wellness_repository.record_list.return_value
    request = pb2.Month(user_id=USER_ID, year=2000, month=1)

    response = await wellness_controller.RecordList(request, MagicMock())

    assert response == pb2.RecordListResponse(
        records=(
            pb2.RecordInfo(
                date=Timestamp(seconds=int(TIMESTAMP.timestamp())),
                metrics=pb2.Metrics(
                    mood=MOOD,
                    sleep_hours=SLEEP_HOURS,
                    activity=ACTIVITY,
                    stress=STRESS,
                    energy=ENERGY,
                    focus=FOCUS,
                ),
            ),
        )
    )


async def test_delete_all(wellness_controller):
    request = pb2.UserId(user_id=USER_ID)

    response = await wellness_controller.DeleteAll(request, MagicMock())

    assert response == Empty()


@pytest.mark.asyncio
async def test_dashboard(cache, wellness_controller):
    cache.get.return_value = None
    request = pb2.DashboardRequest(
        user_id=USER_ID, client_date=Timestamp(seconds=int(TIMESTAMP.timestamp()))
    )

    response = await wellness_controller.Dashboard(request, MagicMock())

    assert response == pb2.DashboardResponse(
        today=pb2.Metrics(
            mood=MOOD,
            sleep_hours=SLEEP_HOURS,
            activity=ACTIVITY,
            stress=STRESS,
            energy=ENERGY,
            focus=FOCUS,
        ),
        week=pb2.DashboardResponse.WeeklyAverages(
            mood=MOOD,
            sleep_hours=SLEEP_HOURS,
            activity=ACTIVITY,
            stress=STRESS,
            energy=ENERGY,
            focus=FOCUS,
            changes={},
        ),
    )


@pytest.mark.asyncio
async def test_analytics(cache, wellness_controller):
    cache.get.return_value = [
        response_dto.PeriodAnalyticsResponseDTO(
            Period.QUARTER,
            response_dto.FeatureImportanceResponseDTO(
                SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS
            ),
            [
                response_dto.ActionItemResponseDTO(
                    Insight.SLEEP_ABOVE_AVG, ACTION_ITEM_PARAMETERS, Priority.MEDIUM
                )
            ],
            TIMESTAMP,
        )
    ]
    request = pb2.UserId(user_id=USER_ID)

    response = await wellness_controller.Analytics(request, MagicMock())

    assert response == pb2.AnalyticsResponse(
        analytics=(
            pb2.AnalyticsResponse.PeriodAnalytics(
                period=Period.QUARTER.name,
                feature_importance=pb2.AnalyticsResponse.FeatureImportance(
                    sleep_hours=SLEEP_HOURS,
                    activity=ACTIVITY,
                    stress=STRESS,
                    energy=ENERGY,
                    focus=FOCUS,
                ),
                insights=(
                    pb2.ActionItem(
                        key=Insight.SLEEP_ABOVE_AVG.name,
                        parameters=ACTION_ITEM_PARAMETERS,
                        priority=Priority.MEDIUM.name,
                    ),
                ),
                generated_at=Timestamp(seconds=int(TIMESTAMP.timestamp())),
            ),
        )
    )


@pytest.mark.asyncio
async def test_recommendations(cache, wellness_controller):
    cache.get.return_value = response_dto.RecommendationsResponseDTO(
        [
            response_dto.ActionItemResponseDTO(
                Recommendation.MORNING_SUNLIGHT, ACTION_ITEM_PARAMETERS, Priority.LOW
            )
        ],
        TIMESTAMP,
    )
    request = pb2.UserId(user_id=USER_ID)

    response = await wellness_controller.Recommendations(request, MagicMock())

    assert response == pb2.RecommendationsResponse(
        recommendations=(
            pb2.ActionItem(
                key=Recommendation.MORNING_SUNLIGHT.name,
                parameters=ACTION_ITEM_PARAMETERS,
                priority=Priority.LOW.name,
            ),
        ),
        generated_at=Timestamp(seconds=int(TIMESTAMP.timestamp())),
    )
