import datetime
from typing import Protocol

from dto import wellness_dto


class WellnessServiceProtocol(Protocol):
    async def upsert_record(self, data: wellness_dto.UpsertRecordDTO) -> None: ...

    async def record_list(
        self, data: wellness_dto.MonthDTO
    ) -> list[wellness_dto.RecordInfoDTO]: ...

    async def delete_all(self, user_id: str) -> None: ...

    async def dashboard(
        self, user_id: str, client_date: datetime.datetime
    ) -> wellness_dto.DashboardDTO: ...

    async def analytics(
        self, user_id: str
    ) -> list[wellness_dto.PeriodAnalyticsDTO]: ...

    async def recommendations(
        self, user_id: str
    ) -> wellness_dto.RecommendationsDTO: ...
