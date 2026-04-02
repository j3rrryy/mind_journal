import pytest

from dto import auth_dto, wellness_dto
from enums import Period, Priority

from ..mocks import (
    ACCESS_TOKEN,
    ACTION_ITEM_PARAMETERS,
    ACTIVITY,
    BROWSER,
    CODE,
    CONFIRMATION_TOKEN,
    COUNTRY_CODE,
    EMAIL,
    ENERGY,
    FEATURE_IMPORTANCE,
    FOCUS,
    INSIGHT,
    LOCALE,
    MOOD,
    PASSWORD,
    RECOMMENDATION,
    REFRESH_TOKEN,
    SESSION_ID,
    SLEEP_HOURS,
    STRESS,
    TIMESTAMP,
    USER_AGENT,
    USER_ID,
    USER_IP,
    USERNAME,
)


@pytest.mark.asyncio
async def test_register(application_facade):
    dto = auth_dto.RegistrationDTO(USERNAME, EMAIL, PASSWORD)

    await application_facade.register(dto, LOCALE)


@pytest.mark.asyncio
async def test_confirm_email(application_facade):
    await application_facade.confirm_email(CONFIRMATION_TOKEN)


@pytest.mark.asyncio
async def test_request_reset_code(application_facade):
    response = await application_facade.request_reset_code(EMAIL, LOCALE)

    assert response == USER_ID


@pytest.mark.asyncio
async def test_validate_reset_code(application_facade):
    dto = auth_dto.ResetCodeDTO(USER_ID, CODE)

    response = await application_facade.validate_reset_code(dto)

    assert response


@pytest.mark.asyncio
async def test_reset_password(application_facade):
    dto = auth_dto.ResetPasswordDTO(USER_ID, PASSWORD)

    await application_facade.reset_password(dto)


@pytest.mark.asyncio
async def test_log_in(application_facade):
    dto = auth_dto.LogInDTO(USERNAME, PASSWORD, USER_IP, USER_AGENT)

    response = await application_facade.log_in(dto, LOCALE)

    assert response.access_token == ACCESS_TOKEN
    assert response.refresh_token == REFRESH_TOKEN
    assert response.email == EMAIL
    assert response.country_code == COUNTRY_CODE
    assert response.browser == BROWSER
    assert response.email_confirmed


@pytest.mark.asyncio
async def test_log_out(application_facade):
    await application_facade.log_out(ACCESS_TOKEN)


@pytest.mark.asyncio
async def test_resend_email_confirmation_mail(application_facade):
    await application_facade.resend_email_confirmation_mail(ACCESS_TOKEN, LOCALE)


@pytest.mark.asyncio
async def test_auth(application_facade):
    response = await application_facade.auth(ACCESS_TOKEN)

    assert response == USER_ID


@pytest.mark.asyncio
async def test_refresh(application_facade):
    dto = auth_dto.RefreshDTO(REFRESH_TOKEN, USER_IP, USER_AGENT)

    response = await application_facade.refresh(dto)

    assert response.access_token == ACCESS_TOKEN
    assert response.refresh_token == REFRESH_TOKEN


@pytest.mark.asyncio
async def test_session_list(application_facade):
    response = await application_facade.session_list(ACCESS_TOKEN)

    assert response[0].session_id == SESSION_ID
    assert response[0].user_ip == USER_IP
    assert response[0].country_code == COUNTRY_CODE
    assert response[0].browser == BROWSER
    assert response[0].created_at == TIMESTAMP


@pytest.mark.asyncio
async def test_revoke_session(application_facade):
    dto = auth_dto.RevokeSessionDTO(ACCESS_TOKEN, SESSION_ID)

    await application_facade.revoke_session(dto)


@pytest.mark.asyncio
async def test_profile(application_facade):
    response = await application_facade.profile(ACCESS_TOKEN)

    assert response.user_id == USER_ID
    assert response.username == USERNAME
    assert response.email == EMAIL
    assert response.email_confirmed
    assert response.registered_at == TIMESTAMP


@pytest.mark.asyncio
async def test_update_email(application_facade):
    dto = auth_dto.UpdateEmailDTO(ACCESS_TOKEN, EMAIL)

    await application_facade.update_email(dto, LOCALE)


@pytest.mark.asyncio
async def test_update_password(application_facade):
    dto = auth_dto.UpdatePasswordDTO(ACCESS_TOKEN, PASSWORD, PASSWORD)

    await application_facade.update_password(dto)


@pytest.mark.asyncio
async def test_delete_profile(application_facade):
    await application_facade.delete_profile(ACCESS_TOKEN)


@pytest.mark.asyncio
async def test_upsert_record(application_facade):
    dto = wellness_dto.UpsertRecordDTO(
        USER_ID,
        TIMESTAMP,
        wellness_dto.MetricsDTO(MOOD, SLEEP_HOURS, ACTIVITY, STRESS, ENERGY, FOCUS),
    )

    await application_facade.upsert_record(ACCESS_TOKEN, dto)


@pytest.mark.asyncio
async def test_record_list(application_facade):
    dto = wellness_dto.MonthDTO(USER_ID, TIMESTAMP.year, TIMESTAMP.month)

    response = await application_facade.record_list(ACCESS_TOKEN, dto)

    assert len(response) == 1
    assert response[0].date == TIMESTAMP
    assert response[0].metrics.mood == MOOD
    assert response[0].metrics.sleep_hours == SLEEP_HOURS
    assert response[0].metrics.activity == ACTIVITY
    assert response[0].metrics.stress == STRESS
    assert response[0].metrics.energy == ENERGY
    assert response[0].metrics.focus == FOCUS


@pytest.mark.asyncio
async def test_delete_all(application_facade):
    await application_facade.delete_all(ACCESS_TOKEN)


@pytest.mark.asyncio
async def test_dashboard(application_facade):
    response = await application_facade.dashboard(ACCESS_TOKEN, TIMESTAMP)

    assert response.today.mood == MOOD
    assert response.today.sleep_hours == SLEEP_HOURS
    assert response.today.activity == ACTIVITY
    assert response.today.stress == STRESS
    assert response.today.energy == ENERGY
    assert response.today.focus == FOCUS
    assert response.week.mood == MOOD
    assert response.week.sleep_hours == SLEEP_HOURS
    assert response.week.activity == ACTIVITY
    assert response.week.stress == STRESS
    assert response.week.energy == ENERGY
    assert response.week.focus == FOCUS
    assert response.week.changes == {}


@pytest.mark.asyncio
async def test_analytics(application_facade):
    response = await application_facade.analytics(ACCESS_TOKEN)

    assert len(response) == 1
    assert response[0].period == Period.QUARTER
    assert round(response[0].feature_importance.sleep_hours, 2) == FEATURE_IMPORTANCE
    assert round(response[0].feature_importance.activity, 2) == FEATURE_IMPORTANCE
    assert round(response[0].feature_importance.stress, 2) == FEATURE_IMPORTANCE
    assert round(response[0].feature_importance.energy, 2) == FEATURE_IMPORTANCE
    assert round(response[0].feature_importance.focus, 2) == FEATURE_IMPORTANCE
    assert len(response[0].insights) == 1
    assert response[0].insights[0].key == INSIGHT
    assert response[0].insights[0].parameters == ACTION_ITEM_PARAMETERS
    assert response[0].insights[0].priority == Priority.LOW
    assert response[0].generated_at == TIMESTAMP


@pytest.mark.asyncio
async def test_recommendations(application_facade):
    response = await application_facade.recommendations(ACCESS_TOKEN)

    assert len(response.recommendations) == 1
    assert response.recommendations[0].key == RECOMMENDATION
    assert response.recommendations[0].parameters == ACTION_ITEM_PARAMETERS
    assert response.recommendations[0].priority == Priority.HIGH
    assert response.generated_at == TIMESTAMP
