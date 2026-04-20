import logging
import random
import time
from typing import cast

import dramatiq
from cashews.backends.redis.client_side import BcastClientSide

from dto import response as response_dto
from enums import Period
from settings import Settings
from utils import analytics_scheduler_key, user_analytics_key, user_recommendations_key

from ..container import get_cache
from .analytics import (
    analyze_half_year,
    analyze_month,
    analyze_quarter,
    analyze_week,
    analyze_year,
)
from .recommendations import generate_recommendations

PERIOD_TO_TASK_AND_TTL = {
    Period.WEEK: (analyze_week, Settings.WEEK_ANALYTICS_TTL),
    Period.MONTH: (analyze_month, Settings.MONTH_ANALYTICS_TTL),
    Period.QUARTER: (analyze_quarter, Settings.QUARTER_ANALYTICS_TTL),
    Period.HALF_YEAR: (analyze_half_year, Settings.HALF_YEAR_ANALYTICS_TTL),
    Period.YEAR: (analyze_year, Settings.YEAR_ANALYTICS_TTL),
}

logger = logging.getLogger()


@dramatiq.actor(queue_name="user_scheduler")
async def analytics_scheduler() -> None:
    cache = get_cache()
    redis_client = cast(BcastClientSide, cache._backends[""])._client
    scheduler_key = analytics_scheduler_key()

    async with cache.lock(scheduler_key, 60, check_interval=30):
        now = int(time.time())
        due_users = await redis_client.zrangebyscore(
            scheduler_key, 0, now, 0, Settings.SCHEDULER_BATCH_SIZE
        )

        if not due_users:
            return

        logger.info(f"Processing {len(due_users)} due users")

        for user_id_bytes in due_users:
            user_id = user_id_bytes.decode()
            analytics, recommendations = await cache.get_many(
                user_analytics_key(user_id), user_recommendations_key(user_id)
            )
            _process_analytics(analytics, user_id, now)
            _process_recommendations(recommendations, user_id, now)

            next_run = (
                now
                if Settings.WORKER_DEBUG
                else now + 86400 + random.randint(-3600, 3600)
            )
            await redis_client.zadd(scheduler_key, {user_id: next_run})


def _process_analytics(
    analytics: list[response_dto.PeriodAnalyticsResponseDTO] | None,
    user_id: str,
    now: int,
) -> None:
    analytics_dict = dict.fromkeys(Period)

    for a in analytics or []:
        analytics_dict[a.period] = a

    for period, period_analytics in analytics_dict.items():
        task, ttl = PERIOD_TO_TASK_AND_TTL[period]
        if period_analytics:
            age = now - int(period_analytics.generated_at.timestamp())
            if age < ttl:
                continue

        task.send(user_id)


def _process_recommendations(
    recommendations: response_dto.RecommendationsResponseDTO | None,
    user_id: str,
    now: int,
) -> None:
    if recommendations:
        age = now - int(recommendations.generated_at.timestamp())
        if age < Settings.RECOMMENDATIONS_TTL:
            return
    generate_recommendations.send(user_id)
