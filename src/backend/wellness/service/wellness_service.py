import datetime
from typing import Any

from cashews import Cache

from dto import request as request_dto
from dto import response as response_dto
from protocols import WellnessRepositoryProtocol, WellnessServiceProtocol
from utils import (
    get_month_range,
    user_all_keys,
    user_analytics_key,
    user_dashboard_key,
    user_recommendations_key,
    user_record_list_key,
    utc_now_naive,
    utc_today,
)


class WellnessService(WellnessServiceProtocol):
    def __init__(self, wellness_repository: WellnessRepositoryProtocol, cache: Cache):
        self._wellness_repository = wellness_repository
        self._cache = cache

    async def upsert_record(self, data: request_dto.UpsertRecordRequestDTO) -> None:
        await self._wellness_repository.upsert_record(data)
        await self._cache.delete(
            user_record_list_key(data.user_id, data.date.year, data.date.month)
        )
        if data.date.date() >= utc_today() - datetime.timedelta(days=15):
            await self._cache.delete(user_dashboard_key(data.user_id))

    async def record_list(
        self, data: request_dto.MonthRequestDTO
    ) -> list[response_dto.RecordInfoResponseDTO]:
        list_key = user_record_list_key(data.user_id, data.year, data.month)
        start_date, end_date = get_month_range(data.year, data.month)
        records = await self._get_cached(
            list_key,
            self._wellness_repository.record_list,
            data.user_id,
            start_date,
            end_date,
        )
        return records

    async def delete_all(self, user_id: str) -> None:
        await self._wellness_repository.delete_all(user_id)
        await self._cache.delete_match(user_all_keys(user_id))

    async def dashboard(
        self, user_id: str, client_date: datetime.datetime
    ) -> response_dto.DashboardResponseDTO:
        dashboard_key = user_dashboard_key(user_id)
        dashboard = await self._get_cached(
            dashboard_key,
            self._wellness_repository.dashboard,
            user_id,
            client_date.date(),
        )
        return dashboard

    async def analytics(
        self, user_id: str
    ) -> list[response_dto.PeriodAnalyticsResponseDTO]:
        return await self._cache.get(user_analytics_key(user_id)) or []

    async def recommendations(
        self, user_id: str
    ) -> response_dto.RecommendationsResponseDTO:
        recommendations = await self._cache.get(user_recommendations_key(user_id))
        return recommendations or response_dto.RecommendationsResponseDTO(
            [], utc_now_naive()
        )

    async def _get_cached(
        self, key: str, getter, *args, ttl: int = 3600, **kwargs
    ) -> Any:
        if cached := await self._cache.get(key):
            return cached
        value = await getter(*args, **kwargs)
        await self._cache.set(key, value, ttl)
        return value
