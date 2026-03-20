import dramatiq

from dto import response as response_dto
from enums import Period
from settings import Settings
from utils import user_analytics_key, user_recommendations_key, utc_now_naive

from ..container import get_cache
from .core import generate_recommendations as gen_recs


@dramatiq.actor
async def generate_recommendations(user_id: str) -> None:
    cache = get_cache()
    analytcis = await cache.get(user_analytics_key(user_id))
    if not analytcis:
        return

    analytics_dict = {item.period: item for item in analytcis}
    week_analytics = analytics_dict.get(Period.WEEK)
    month_analytics = analytics_dict.get(Period.MONTH)
    if not week_analytics and not month_analytics:
        return

    recommendations_dto = response_dto.RecommendationsResponseDTO(
        gen_recs(week_analytics, month_analytics), utc_now_naive()
    )
    await cache.set(
        user_recommendations_key(user_id),
        recommendations_dto,
        Settings.RECOMMENDATIONS_TTL * 1.3,
    )
