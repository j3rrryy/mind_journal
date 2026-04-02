import msgspec
import pytest
from litestar.status_codes import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from enums import Period, Priority
from schemas import wellness_schemas

from ...mocks import (
    ACCESS_TOKEN,
    ACTION_ITEM_PARAMETERS,
    ACTIVITY,
    ENERGY,
    FEATURE_IMPORTANCE,
    FOCUS,
    INSIGHT,
    MOOD,
    RECOMMENDATION,
    SLEEP_HOURS,
    STRESS,
    TIMESTAMP,
)

PREFIX = "/api/v1/wellness"


@pytest.mark.asyncio
async def test_upsert_record(client):
    data = wellness_schemas.RecordInfo(
        TIMESTAMP.date(),
        wellness_schemas.Metrics(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
    )

    response = await client.post(
        f"{PREFIX}/records",
        content=msgspec.msgpack.encode(data),
        headers={
            "Content-Type": "application/msgpack",
            "Authorization": f"Bearer {ACCESS_TOKEN}",
        },
    )

    assert response.status_code == HTTP_201_CREATED


@pytest.mark.asyncio
async def test_record_list(client):
    response = await client.get(
        f"{PREFIX}/records/{TIMESTAMP.year}/{TIMESTAMP.month}",
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
    )

    response_data = msgspec.msgpack.decode(response.content)
    assert response.status_code == HTTP_200_OK
    assert response_data == {
        "records": [
            {
                "date": TIMESTAMP.date().isoformat(),
                "metrics": {
                    "mood": MOOD,
                    "sleep_hours": SLEEP_HOURS,
                    "activity": ACTIVITY,
                    "stress": STRESS,
                    "energy": ENERGY,
                    "focus": FOCUS,
                },
            }
        ]
    }


@pytest.mark.asyncio
async def test_delete_all(client):
    response = await client.delete(
        f"{PREFIX}/records/all", headers={"Authorization": f"Bearer {ACCESS_TOKEN}"}
    )

    assert response.status_code == HTTP_204_NO_CONTENT


@pytest.mark.asyncio
async def test_dashboard(client):
    response = await client.get(
        f"{PREFIX}/dashboard/{TIMESTAMP.date().isoformat()}",
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
    )

    response_data = msgspec.msgpack.decode(response.content)
    assert response.status_code == HTTP_200_OK
    assert response_data == {
        "today": {
            "mood": MOOD,
            "sleep_hours": SLEEP_HOURS,
            "activity": ACTIVITY,
            "stress": STRESS,
            "energy": ENERGY,
            "focus": FOCUS,
        },
        "week": {
            "mood": MOOD,
            "sleep_hours": SLEEP_HOURS,
            "activity": ACTIVITY,
            "stress": STRESS,
            "energy": ENERGY,
            "focus": FOCUS,
            "changes": {},
        },
    }


@pytest.mark.asyncio
async def test_analytics(client):
    response = await client.get(
        f"{PREFIX}/analytics", headers={"Authorization": f"Bearer {ACCESS_TOKEN}"}
    )

    response_data = msgspec.msgpack.decode(response.content)
    response_data["analytics"][0]["feature_importance"] = {
        k: round(v, 2)
        for k, v in response_data["analytics"][0]["feature_importance"].items()
    }
    assert response.status_code == HTTP_200_OK
    assert response_data == {
        "analytics": [
            {
                "period": Period.QUARTER.value,
                "feature_importance": {
                    "sleep_hours": FEATURE_IMPORTANCE,
                    "activity": FEATURE_IMPORTANCE,
                    "stress": FEATURE_IMPORTANCE,
                    "energy": FEATURE_IMPORTANCE,
                    "focus": FEATURE_IMPORTANCE,
                },
                "insights": [
                    {
                        "insight": INSIGHT.value,
                        "parameters": ACTION_ITEM_PARAMETERS,
                        "priority": Priority.LOW.value,
                    }
                ],
                "generated_at": TIMESTAMP.isoformat(),
            }
        ],
    }


@pytest.mark.asyncio
async def test_recommendations(client):
    response = await client.get(
        f"{PREFIX}/recommendations", headers={"Authorization": f"Bearer {ACCESS_TOKEN}"}
    )

    response_data = msgspec.msgpack.decode(response.content)
    assert response.status_code == HTTP_200_OK
    assert response_data == {
        "recommendations": [
            {
                "recommendation": RECOMMENDATION.value,
                "parameters": ACTION_ITEM_PARAMETERS,
                "priority": Priority.HIGH.value,
            }
        ],
        "generated_at": TIMESTAMP.isoformat(),
    }
