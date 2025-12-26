import datetime

from dto import wellness_dto
from proto import wellness_pb2 as pb2
from protocols import WellnessServiceProtocol

from .base_adapter import BaseRPCAdapter


class WellnessGrpcAdapter(BaseRPCAdapter, WellnessServiceProtocol):
    @BaseRPCAdapter.exception_handler
    async def upsert_record(self, data: wellness_dto.UpsertRecordDTO) -> None:
        request = data.to_request(pb2.UpsertRecordRequest)
        await self._stub.UpsertRecord(request)

    @BaseRPCAdapter.exception_handler
    async def record_list(
        self, data: wellness_dto.MonthDTO
    ) -> list[wellness_dto.RecordInfoDTO]:
        request = data.to_request(pb2.Month)
        records: pb2.RecordListResponse = await self._stub.RecordList(request)
        return [
            wellness_dto.RecordInfoDTO.from_response(record)
            for record in records.records
        ]

    @BaseRPCAdapter.exception_handler
    async def delete_all(self, user_id: str) -> None:
        request = pb2.UserId(user_id=user_id)
        await self._stub.DeleteAll(request)

    @BaseRPCAdapter.exception_handler
    async def dashboard(
        self, user_id: str, client_date: datetime.datetime
    ) -> wellness_dto.DashboardDTO:
        request = pb2.DashboardRequest(user_id=user_id, client_date=client_date)
        dashboard: pb2.DashboardResponse = await self._stub.Dashboard(request)
        return wellness_dto.DashboardDTO.from_response(dashboard)

    @BaseRPCAdapter.exception_handler
    async def analytics(self, user_id: str) -> list[wellness_dto.PeriodAnalyticsDTO]:
        request = pb2.UserId(user_id=user_id)
        analytics: pb2.AnalyticsResponse = await self._stub.Analytics(request)
        return [
            wellness_dto.PeriodAnalyticsDTO.from_response(a)
            for a in analytics.analytics
        ]

    @BaseRPCAdapter.exception_handler
    async def recommendations(self, user_id: str) -> wellness_dto.RecommendationsDTO:
        request = pb2.UserId(user_id=user_id)
        recs: pb2.RecommendationsResponse = await self._stub.Recommendations(request)
        return wellness_dto.RecommendationsDTO.from_response(recs)
