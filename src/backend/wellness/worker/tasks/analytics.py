import datetime

import dramatiq
from cashews import Cache

from dto import response as response_dto
from enums import AnalyticsLevel, Period
from settings import Settings
from utils import user_analytics_key, utc_now_naive, utc_today

from ..container import get_cache, get_wellness_repository
from .analytics_core import compute_feature_importance, generate_insights


@dramatiq.actor
async def analyze_week(user_id: str) -> None:
    await _analyze_period(user_id, Period.WEEK, 7, 3)


@dramatiq.actor
async def analyze_month(user_id: str) -> None:
    await _analyze_period(user_id, Period.MONTH, 30, 7)


@dramatiq.actor
async def analyze_quarter(user_id: str) -> None:
    await _analyze_period(user_id, Period.QUARTER, 90, 14)


@dramatiq.actor
async def analyze_half_year(user_id: str) -> None:
    await _analyze_period(user_id, Period.HALF_YEAR, 180, 30)


@dramatiq.actor
async def analyze_year(user_id: str) -> None:
    await _analyze_period(user_id, Period.YEAR, 365, 60)


async def _analyze_period(
    user_id: str, period: Period, days: int, min_records: int
) -> None:
    wellness_repository, cache = get_wellness_repository(), get_cache()
    end_date = utc_today()
    start_date = end_date - datetime.timedelta(days=days)
    records = await wellness_repository.record_list(user_id, start_date, end_date)
    count = len(records)

    if count < min_records:
        return
    elif count <= 7:
        level = AnalyticsLevel.BASIC
    elif count <= 30:
        level = AnalyticsLevel.INTERMEDIATE
    else:
        level = AnalyticsLevel.ADVANCED

    analytics_dto = response_dto.PeriodAnalyticsResponseDTO(
        period=period,
        feature_importance=compute_feature_importance(records, level),
        insights=generate_insights(records, level),
        generated_at=utc_now_naive(),
    )
    await _save_analytics(user_id, analytics_dto, cache)


async def _save_analytics(
    user_id: str, new_analytics: response_dto.PeriodAnalyticsResponseDTO, cache: Cache
) -> None:
    analytics_key = user_analytics_key(user_id)
    existing = await cache.get(analytics_key) or []
    analytics_dict = {item.period: item for item in existing}
    analytics_dict[new_analytics.period] = new_analytics
    await cache.set(
        analytics_key,
        list(analytics_dict.values()),
        int(Settings.YEAR_ANALYTICS_TTL * 1.3),
    )
