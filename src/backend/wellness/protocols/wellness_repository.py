import datetime
from typing import Protocol

from dto import request as request_dto
from dto import response as response_dto


class WellnessRepositoryProtocol(Protocol):
    async def upsert_record(self, data: request_dto.UpsertRecordRequestDTO) -> None: ...

    async def record_list(
        self, data: request_dto.MonthRequestDTO
    ) -> list[response_dto.RecordInfoResponseDTO]: ...

    async def delete_all(self, user_id: str) -> None: ...

    async def dashboard(
        self, user_id: str, client_date: datetime.date
    ) -> response_dto.DashboardResponseDTO: ...
