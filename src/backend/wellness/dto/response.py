import datetime
from dataclasses import dataclass
from typing import TYPE_CHECKING, Type, cast

from enums import Insight, Metric, Period, Priority, Recommendation
from proto import wellness_pb2 as pb2
from utils import date_to_datetime

from .base import BaseResponseDTO, DeclarativeBase, GrpcMessage, MetricsDTO

if TYPE_CHECKING:
    from repository import Record


@dataclass(slots=True, frozen=True)
class RecordInfoResponseDTO(BaseResponseDTO):
    date: datetime.datetime
    metrics: MetricsDTO

    @classmethod
    def from_model(
        cls: Type["RecordInfoResponseDTO"], model: DeclarativeBase
    ) -> "RecordInfoResponseDTO":
        model = cast("Record", model)
        return cls(date_to_datetime(model.date), MetricsDTO.from_model(model))

    def to_response(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(date=self.date, metrics=self.metrics.to_response(pb2.Metrics))


@dataclass(slots=True, frozen=True)
class WeeklyAveragesResponseDTO(BaseResponseDTO):
    mood: float
    sleep_hours: float
    activity: float
    stress: float
    energy: float
    focus: float
    changes: dict[Metric, float]

    def to_response(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(
            mood=self.mood,
            sleep_hours=self.sleep_hours,
            activity=self.activity,
            stress=self.stress,
            energy=self.energy,
            focus=self.focus,
            changes={metric.name: change for metric, change in self.changes.items()},
        )


@dataclass(slots=True, frozen=True)
class DashboardResponseDTO(BaseResponseDTO):
    today: MetricsDTO | None
    week: WeeklyAveragesResponseDTO

    def to_response(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(
            today=self.today.to_response(pb2.Metrics) if self.today else None,
            week=self.week.to_response(pb2.DashboardResponse.WeeklyAverages),
        )


@dataclass(slots=True, frozen=True)
class FeatureImportanceResponseDTO(BaseResponseDTO):
    sleep_hours: float
    activity: float
    stress: float
    energy: float
    focus: float


@dataclass(slots=True, frozen=True)
class ActionItemResponseDTO(BaseResponseDTO):
    key: Insight | Recommendation
    parameters: dict[str, float]
    priority: Priority

    def to_response(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(
            key=self.key.name, parameters=self.parameters, priority=self.priority.name
        )


@dataclass(slots=True, frozen=True)
class PeriodAnalyticsResponseDTO(BaseResponseDTO):
    period: Period
    feature_importance: FeatureImportanceResponseDTO
    insights: list[ActionItemResponseDTO]
    generated_at: datetime.datetime

    def to_response(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(
            period=self.period.name,
            feature_importance=self.feature_importance.to_response(
                pb2.AnalyticsResponse.FeatureImportance
            ),
            insights=[insight.to_response(pb2.ActionItem) for insight in self.insights],
            generated_at=self.generated_at,
        )


@dataclass(slots=True, frozen=True)
class RecommendationsResponseDTO(BaseResponseDTO):
    recommendations: list[ActionItemResponseDTO]
    generated_at: datetime.datetime

    def to_response(self, message: type[GrpcMessage]) -> GrpcMessage:
        return message(
            recommendations=[
                recommendation.to_response(pb2.ActionItem)
                for recommendation in self.recommendations
            ],
            generated_at=self.generated_at,
        )
