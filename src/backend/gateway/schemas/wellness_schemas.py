import datetime
from typing import Annotated

from msgspec import Meta, Struct

from enums import Insight as Ins
from enums import Metric, Period, Priority
from enums import Recommendation as Rec


class Metrics(Struct):
    mood: Annotated[int, Meta(ge=0, le=10)]
    sleep_hours: Annotated[float, Meta(ge=0, le=24)]
    activity: Annotated[int, Meta(ge=0, le=10)]
    stress: Annotated[int, Meta(ge=0, le=10)]
    energy: Annotated[int, Meta(ge=0, le=10)]
    focus: Annotated[int, Meta(ge=0, le=10)]


class RecordInfo(Struct):
    date: datetime.date
    metrics: Metrics


class RecordList(Struct):
    records: list[RecordInfo]


class WeeklyAverages(Struct):
    mood: Annotated[float, Meta(ge=0, le=10)]
    sleep_hours: Annotated[float, Meta(ge=0, le=24)]
    activity: Annotated[float, Meta(ge=0, le=10)]
    stress: Annotated[float, Meta(ge=0, le=10)]
    energy: Annotated[float, Meta(ge=0, le=10)]
    focus: Annotated[float, Meta(ge=0, le=10)]
    changes: dict[Metric, float]


class Dashboard(Struct):
    today: Metrics | None
    week: WeeklyAverages


class ActionItem(Struct):
    parameters: dict[str, float]
    priority: Priority


class FeatureImportance(Struct):
    sleep_hours: Annotated[float, Meta(ge=0, le=1)]
    activity: Annotated[float, Meta(ge=0, le=1)]
    stress: Annotated[float, Meta(ge=0, le=1)]
    energy: Annotated[float, Meta(ge=0, le=1)]
    focus: Annotated[float, Meta(ge=0, le=1)]


class Insight(ActionItem):
    insight: Ins


class PeriodAnalytics(Struct):
    period: Period
    feature_importance: FeatureImportance
    insights: list[Insight]
    generated_at: datetime.datetime


class Analytics(Struct):
    analytics: list[PeriodAnalytics]


class Recommendation(ActionItem):
    recommendation: Rec


class Recommendations(Struct):
    recommendations: list[Recommendation]
    generated_at: datetime.datetime
