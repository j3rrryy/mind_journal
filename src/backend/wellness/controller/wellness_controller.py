from google.protobuf import empty_pb2

from dto import request as request_dto
from proto import WellnessServicer
from proto import wellness_pb2 as pb2
from protocols import WellnessServiceProtocol


class WellnessController(WellnessServicer):
    def __init__(self, wellness_service: WellnessServiceProtocol):
        self._wellness_service = wellness_service

    async def UpsertRecord(self, request, context):
        dto = request_dto.UpsertRecordRequestDTO.from_request(request)
        await self._wellness_service.upsert_record(dto)
        return empty_pb2.Empty()

    async def RecordList(self, request, context):
        dto = request_dto.MonthRequestDTO.from_request(request)
        records = await self._wellness_service.record_list(dto)
        return pb2.RecordListResponse(
            records=(record.to_response(pb2.RecordInfo) for record in records)
        )

    async def DeleteAll(self, request, context):
        await self._wellness_service.delete_all(request.user_id)
        return empty_pb2.Empty()

    async def Dashboard(self, request, context):
        dashboard = await self._wellness_service.dashboard(
            request.user_id, request.client_date.ToDatetime()
        )
        return dashboard.to_response(pb2.DashboardResponse)

    async def Analytics(self, request, context):
        analytics = await self._wellness_service.analytics(request.user_id)
        return pb2.AnalyticsResponse(
            analytics=(
                a.to_response(pb2.AnalyticsResponse.PeriodAnalytics) for a in analytics
            )
        )

    async def Recommendations(self, request, context):
        recommendations = await self._wellness_service.recommendations(request.user_id)
        return recommendations.to_response(pb2.RecommendationsResponse)
