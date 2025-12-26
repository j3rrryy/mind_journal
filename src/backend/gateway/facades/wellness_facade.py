import datetime

from dto import wellness_dto
from protocols import WellnessFacadeProtocol, WellnessServiceProtocol


class WellnessFacade(WellnessFacadeProtocol):
    def __init__(self, wellness_service: WellnessServiceProtocol):
        self._wellness_service = wellness_service

    async def upsert_record(self, data: wellness_dto.UpsertRecordDTO) -> None:
        await self._wellness_service.upsert_record(data)

    async def record_list(
        self, data: wellness_dto.MonthDTO
    ) -> list[wellness_dto.RecordInfoDTO]:
        return await self._wellness_service.record_list(data)

    async def delete_all(self, user_id: str) -> None:
        await self._wellness_service.delete_all(user_id)

    async def dashboard(
        self, user_id: str, client_date: datetime.datetime
    ) -> wellness_dto.DashboardDTO:
        return await self._wellness_service.dashboard(user_id, client_date)

    async def analytics(self, user_id: str) -> list[wellness_dto.PeriodAnalyticsDTO]:
        return await self._wellness_service.analytics(user_id)

    async def recommendations(self, user_id: str) -> wellness_dto.RecommendationsDTO:
        return await self._wellness_service.recommendations(user_id)
