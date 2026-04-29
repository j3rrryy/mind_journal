import datetime
from dataclasses import dataclass
from typing import Type, cast

from enums import Insight, Metric, Period, Priority, Recommendation
from proto import wellness_pb2 as pb2
from schemas import wellness_schemas

from .base_dto import (
    FromResponseMixin,
    FromSchemaMixin,
    GrpcMessage,
    Message,
    MsgspecStruct,
    ToRequestMixin,
    ToSchemaMixin,
)


@dataclass(slots=True, frozen=True)
class MetricsDTO(FromResponseMixin, FromSchemaMixin, ToRequestMixin, ToSchemaMixin):
    mood: int
    sleep_hours: float
    activity: int
    stress: int
    energy: int
    focus: int


@dataclass(slots=True, frozen=True)
class UpsertRecordDTO(ToRequestMixin):
    user_id: str
    date: datetime.datetime
    metrics: MetricsDTO

    def to_request(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(
            user_id=self.user_id,
            date=self.date,
            metrics=self.metrics.to_request(pb2.Metrics),
        )


@dataclass(slots=True, frozen=True)
class MonthDTO(ToRequestMixin):
    user_id: str
    year: int
    month: int


@dataclass(slots=True, frozen=True)
class RecordInfoDTO(FromResponseMixin, ToSchemaMixin):
    date: datetime.datetime
    metrics: MetricsDTO

    @classmethod
    def from_response(cls: Type["RecordInfoDTO"], message: Message) -> "RecordInfoDTO":
        message = cast(pb2.RecordInfo, message)
        return cls(message.date.ToDatetime(), MetricsDTO.from_response(message.metrics))

    def to_schema(self, schema: type[MsgspecStruct]) -> MsgspecStruct:
        return schema(
            self.date.date(), self.metrics.to_schema(wellness_schemas.Metrics)
        )


@dataclass(slots=True, frozen=True)
class WeeklyAveragesDTO(FromResponseMixin, ToSchemaMixin):
    mood: float
    sleep_hours: float
    activity: float
    stress: float
    energy: float
    focus: float
    changes: dict[Metric, float]

    @classmethod
    def from_response(
        cls: Type["WeeklyAveragesDTO"], message: Message
    ) -> "WeeklyAveragesDTO":
        message = cast(pb2.DashboardResponse.WeeklyAverages, message)
        return cls(
            message.mood,
            message.sleep_hours,
            message.activity,
            message.stress,
            message.energy,
            message.focus,
            {Metric[metric]: change for metric, change in message.changes.items()},
        )


@dataclass(slots=True, frozen=True)
class DashboardDTO(FromResponseMixin, ToSchemaMixin):
    today: MetricsDTO | None
    week: WeeklyAveragesDTO

    @classmethod
    def from_response(cls: Type["DashboardDTO"], message: Message) -> "DashboardDTO":
        message = cast(pb2.DashboardResponse, message)
        today = (
            MetricsDTO.from_response(message.today)
            if message.HasField("today")
            else None
        )
        return cls(today, WeeklyAveragesDTO.from_response(message.week))

    def to_schema(self, schema: type[MsgspecStruct]) -> MsgspecStruct:
        return schema(
            self.today.to_schema(wellness_schemas.Metrics) if self.today else None,
            self.week.to_schema(wellness_schemas.WeeklyAverages),
        )


@dataclass(slots=True, frozen=True)
class FeatureImportanceDTO(FromResponseMixin, ToSchemaMixin):
    sleep_hours: float
    activity: float
    stress: float
    energy: float
    focus: float


@dataclass(slots=True, frozen=True)
class ActionItemDTO(ToSchemaMixin):
    key: Insight | Recommendation
    parameters: dict[str, str]
    priority: Priority

    @classmethod
    def from_response(
        cls: Type["ActionItemDTO"],
        message: Message,
        key_type: type[Insight] | type[Recommendation],
    ) -> "ActionItemDTO":
        message = cast(pb2.ActionItem, message)
        return cls(
            key_type[message.key], dict(message.parameters), Priority[message.priority]
        )

    def to_schema(self, schema: type[MsgspecStruct]) -> MsgspecStruct:
        return schema(self.parameters, self.priority, self.key)


@dataclass(slots=True, frozen=True)
class PeriodAnalyticsDTO(FromResponseMixin, ToSchemaMixin):
    period: Period
    feature_importance: FeatureImportanceDTO
    insights: list[ActionItemDTO]
    generated_at: datetime.datetime

    @classmethod
    def from_response(
        cls: Type["PeriodAnalyticsDTO"], message: Message
    ) -> "PeriodAnalyticsDTO":
        message = cast(pb2.AnalyticsResponse.PeriodAnalytics, message)
        insights = [
            ActionItemDTO.from_response(insight, Insight)
            for insight in message.insights
        ]
        return cls(
            Period[message.period],
            FeatureImportanceDTO.from_response(message.feature_importance),
            insights,
            message.generated_at.ToDatetime(),
        )

    def to_schema(self, schema: type[MsgspecStruct]) -> MsgspecStruct:
        return schema(
            self.period,
            self.feature_importance.to_schema(wellness_schemas.FeatureImportance),
            [insight.to_schema(wellness_schemas.Insight) for insight in self.insights],
            self.generated_at,
        )


@dataclass(slots=True, frozen=True)
class RecommendationsDTO(FromResponseMixin, ToSchemaMixin):
    recommendations: list[ActionItemDTO]
    generated_at: datetime.datetime

    @classmethod
    def from_response(
        cls: Type["RecommendationsDTO"], message: Message
    ) -> "RecommendationsDTO":
        message = cast(pb2.RecommendationsResponse, message)
        recommendations = [
            ActionItemDTO.from_response(recommendation, Recommendation)
            for recommendation in message.recommendations
        ]
        return cls(recommendations, message.generated_at.ToDatetime())

    def to_schema(self, schema: type[MsgspecStruct]) -> MsgspecStruct:
        return schema(
            [
                recommendation.to_schema(wellness_schemas.Recommendation)
                for recommendation in self.recommendations
            ],
            self.generated_at,
        )
