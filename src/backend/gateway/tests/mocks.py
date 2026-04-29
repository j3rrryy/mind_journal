import datetime
from typing import Any
from unittest.mock import AsyncMock

from aiokafka import AIOKafkaProducer
from google.protobuf.empty_pb2 import Empty
from google.protobuf.timestamp_pb2 import Timestamp

from enums import Insight, Period, Priority, Recommendation
from proto import AuthStub, WellnessStub, auth_pb2, wellness_pb2

TIMESTAMP = datetime.datetime(2005, 1, 1, 0, 2, 3)
TIMESTAMP_MOCK = Timestamp(seconds=1104537723)

ACCESS_TOKEN = "eyJ0eXBlIjowLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.fyxQuUSic9USlnl9vXYYIelRBTaxsdILiosQHVIOUlU"
REFRESH_TOKEN = "eyJ0eXBlIjoxLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.Cz6F9m9TJP76hzcyst0xE9vp6RmXtGIhAXaNqJWrJL8"
CONFIRMATION_TOKEN = "eyJ0eXBlIjoyLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.1ukhU0OncZBofD_z3O5q5wrhoHaRm_RtAZAtqxI6CUY"
CODE = "123456"

USER_ID = "00e51a90-0f94-4ecb-8dd1-399ba409508e"
USERNAME = "test_username"
EMAIL = "test@example.com"
PASSWORD = "p@ssw0rd"
LOCALE = "en"

SESSION_ID = "13bcdea3-dd61-40fb-8f1f-f9546fd8ffc5"
USER_IP = "127.0.0.1"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
)
COUNTRY_CODE = "US"
BROWSER = "Firefox 47.0, Windows 7"


MOOD = 7
SLEEP_HOURS = 7.5
ACTIVITY = 5
STRESS = 1
ENERGY = 9
FOCUS = 6

FEATURE_IMPORTANCE = 0.2
INSIGHT = Insight.UNUSUAL_LOW_ENERGY
RECOMMENDATION = Recommendation.TAKE_BREAKS
ACTION_ITEM_PARAMETERS = {"param1": "2.0", "param2": "aaa"}


def create_auth_stub_v1() -> AuthStub:
    stub = AsyncMock(spec=AuthStub)

    stub.Register = AsyncMock(
        return_value=auth_pb2.EmailConfirmationMail(
            token=CONFIRMATION_TOKEN, username=USERNAME, email=EMAIL
        )
    )
    stub.ConfirmEmail = AsyncMock(return_value=Empty())
    stub.RequestResetCode = AsyncMock(
        return_value=auth_pb2.ResetCodeResponse(
            user_id=USER_ID, username=USERNAME, code=CODE
        )
    )
    stub.ValidateResetCode = AsyncMock(return_value=auth_pb2.CodeIsValid(is_valid=True))
    stub.ResetPassword = AsyncMock(return_value=Empty())
    stub.LogIn = AsyncMock(
        return_value=auth_pb2.LogInResponse(
            access_token=ACCESS_TOKEN,
            refresh_token=REFRESH_TOKEN,
            email=EMAIL,
            country_code=COUNTRY_CODE,
            browser=BROWSER,
            email_confirmed=True,
        )
    )
    stub.LogOut = AsyncMock(return_value=Empty())
    stub.ResendEmailConfirmationMail = AsyncMock(
        return_value=auth_pb2.EmailConfirmationMail(
            token=CONFIRMATION_TOKEN, username=USERNAME, email=EMAIL
        )
    )
    stub.Auth = AsyncMock(return_value=auth_pb2.UserId(user_id=USER_ID))
    stub.Refresh = AsyncMock(
        return_value=auth_pb2.Tokens(
            access_token=ACCESS_TOKEN, refresh_token=REFRESH_TOKEN
        )
    )
    stub.SessionList = AsyncMock(
        return_value=auth_pb2.Sessions(
            sessions=(
                auth_pb2.SessionInfo(
                    session_id=SESSION_ID,
                    user_ip=USER_IP,
                    country_code=COUNTRY_CODE,
                    browser=BROWSER,
                    created_at=TIMESTAMP_MOCK,
                ),
            )
        )
    )
    stub.RevokeSession = AsyncMock(return_value=Empty())
    stub.Profile = AsyncMock(
        return_value=auth_pb2.ProfileResponse(
            user_id=USER_ID,
            username=USERNAME,
            email=EMAIL,
            email_confirmed=True,
            registered_at=TIMESTAMP_MOCK,
        )
    )
    stub.UpdateEmail = AsyncMock(
        return_value=auth_pb2.EmailConfirmationMail(
            token=CONFIRMATION_TOKEN, username=USERNAME, email=EMAIL
        )
    )
    stub.UpdatePassword = AsyncMock(return_value=Empty())
    stub.DeleteProfile = AsyncMock(return_value=auth_pb2.UserId(user_id=USER_ID))
    return stub


def create_metrics() -> dict[str, Any]:
    return dict(
        mood=MOOD,
        sleep_hours=SLEEP_HOURS,
        activity=ACTIVITY,
        stress=STRESS,
        energy=ENERGY,
        focus=FOCUS,
    )


def create_wellness_stub_v1() -> WellnessStub:
    stub = AsyncMock(spec=WellnessStub)

    stub.UpsertRecord = AsyncMock(return_value=Empty())
    stub.RecordList = AsyncMock(
        return_value=wellness_pb2.RecordListResponse(
            records=(
                wellness_pb2.RecordInfo(
                    date=TIMESTAMP_MOCK,
                    metrics=wellness_pb2.Metrics(**create_metrics()),
                ),
            )
        )
    )
    stub.DeleteAll = AsyncMock(return_value=Empty())
    stub.Dashboard = AsyncMock(
        return_value=wellness_pb2.DashboardResponse(
            today=wellness_pb2.Metrics(**create_metrics()),
            week=wellness_pb2.DashboardResponse.WeeklyAverages(**create_metrics()),
        )
    )
    stub.Analytics = AsyncMock(
        return_value=wellness_pb2.AnalyticsResponse(
            analytics=[
                wellness_pb2.AnalyticsResponse.PeriodAnalytics(
                    period=Period.QUARTER.name,
                    feature_importance=wellness_pb2.AnalyticsResponse.FeatureImportance(
                        sleep_hours=FEATURE_IMPORTANCE,
                        activity=FEATURE_IMPORTANCE,
                        stress=FEATURE_IMPORTANCE,
                        energy=FEATURE_IMPORTANCE,
                        focus=FEATURE_IMPORTANCE,
                    ),
                    insights=[
                        wellness_pb2.ActionItem(
                            key=INSIGHT.name,
                            parameters=ACTION_ITEM_PARAMETERS,
                            priority=Priority.LOW.name,
                        )
                    ],
                    generated_at=TIMESTAMP_MOCK,
                )
            ]
        )
    )
    stub.Recommendations = AsyncMock(
        return_value=wellness_pb2.RecommendationsResponse(
            recommendations=[
                wellness_pb2.ActionItem(
                    key=RECOMMENDATION.name,
                    parameters=ACTION_ITEM_PARAMETERS,
                    priority=Priority.HIGH.name,
                )
            ],
            generated_at=TIMESTAMP_MOCK,
        )
    )
    return stub


def create_mail_producer() -> AIOKafkaProducer:
    return AsyncMock(spec=AIOKafkaProducer)
