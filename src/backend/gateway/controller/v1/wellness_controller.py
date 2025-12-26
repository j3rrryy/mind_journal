import datetime
from typing import Annotated

from litestar import Controller, MediaType, Request, Router, delete, get, post
from litestar.enums import RequestEncodingType
from litestar.params import Body, Parameter
from litestar.status_codes import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT

from dto import wellness_dto
from protocols import ApplicationFacadeProtocol
from schemas import wellness_schemas
from validators import validate_access_token, validate_date, validate_year_month_future


class WellnessController(Controller):
    path = "/wellness"

    @post("/records", status_code=HTTP_201_CREATED)
    async def upsert_record(
        self,
        data: Annotated[
            wellness_schemas.RecordInfo,
            Body(media_type=RequestEncodingType.MESSAGEPACK),
        ],
        request: Request,
        application_facade: ApplicationFacadeProtocol,
    ) -> None:
        access_token = validate_access_token(request)
        dto = wellness_dto.UpsertRecordDTO(
            "",
            validate_date(data.date),
            wellness_dto.MetricsDTO.from_schema(data.metrics),
        )
        await application_facade.upsert_record(access_token, dto)

    @get(
        "/records/{year: int}/{month: int}",
        status_code=HTTP_200_OK,
        response_model=wellness_schemas.RecordList,
        media_type=MediaType.MESSAGEPACK,
    )
    async def record_list(
        self,
        year: Annotated[int, Parameter(ge=2000)],
        month: Annotated[int, Parameter(ge=1, le=12)],
        request: Request,
        application_facade: ApplicationFacadeProtocol,
    ) -> wellness_schemas.RecordList:
        access_token = validate_access_token(request)
        dto = wellness_dto.MonthDTO("", *validate_year_month_future(year, month))
        records = await application_facade.record_list(access_token, dto)
        return wellness_schemas.RecordList(
            [record.to_schema(wellness_schemas.RecordInfo) for record in records]
        )

    @delete("/records/all", status_code=HTTP_204_NO_CONTENT)
    async def delete_all(
        self, request: Request, application_facade: ApplicationFacadeProtocol
    ) -> None:
        access_token = validate_access_token(request)
        await application_facade.delete_all(access_token)

    @get(
        "/dashboard/{client_date: date}",
        status_code=HTTP_200_OK,
        response_model=wellness_schemas.Dashboard,
        media_type=MediaType.MESSAGEPACK,
    )
    async def dashboard(
        self,
        client_date: datetime.date,
        request: Request,
        application_facade: ApplicationFacadeProtocol,
    ) -> wellness_schemas.Dashboard:
        access_token = validate_access_token(request)
        dashboard = await application_facade.dashboard(
            access_token, validate_date(client_date)
        )
        return dashboard.to_schema(wellness_schemas.Dashboard)

    @get(
        "/analytics",
        status_code=HTTP_200_OK,
        response_model=wellness_schemas.Analytics,
        media_type=MediaType.MESSAGEPACK,
    )
    async def analytics(
        self, request: Request, application_facade: ApplicationFacadeProtocol
    ) -> wellness_schemas.Analytics:
        access_token = validate_access_token(request)
        analytics = await application_facade.analytics(access_token)
        return wellness_schemas.Analytics(
            [a.to_schema(wellness_schemas.PeriodAnalytics) for a in analytics]
        )

    @get(
        "/recommendations",
        status_code=HTTP_200_OK,
        response_model=wellness_schemas.Recommendations,
        media_type=MediaType.MESSAGEPACK,
    )
    async def recommendations(
        self, request: Request, application_facade: ApplicationFacadeProtocol
    ) -> wellness_schemas.Recommendations:
        access_token = validate_access_token(request)
        recommendations = await application_facade.recommendations(access_token)
        return recommendations.to_schema(wellness_schemas.Recommendations)


wellness_router = Router(
    "/v1", route_handlers=(WellnessController,), tags=("wellness",)
)
