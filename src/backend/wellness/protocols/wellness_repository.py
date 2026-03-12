import datetime
from typing import Protocol

from dto import request as request_dto
from dto import response as response_dto


class WellnessRepositoryProtocol(Protocol):
    async def upsert_record(self, data: request_dto.UpsertRecordRequestDTO) -> None: ...

    async def record_list(
        self, user_id: str, start_date: datetime.date, end_date: datetime.date
    ) -> list[response_dto.RecordInfoResponseDTO]: ...

    async def delete_all(self, user_id: str) -> None: ...

    async def dashboard(
        self, user_id: str, client_date: datetime.date
    ) -> response_dto.DashboardResponseDTO: ...

    async def get_all_user_ids(self) -> list[str]: ...
