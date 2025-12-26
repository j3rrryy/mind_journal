import datetime
from collections.abc import Iterable as _Iterable
from collections.abc import Mapping as _Mapping
from typing import ClassVar as _ClassVar
from typing import Optional as _Optional
from typing import Union as _Union

from google.protobuf import descriptor as _descriptor
from google.protobuf import empty_pb2 as _empty_pb2
from google.protobuf import message as _message
from google.protobuf import timestamp_pb2 as _timestamp_pb2
from google.protobuf.internal import containers as _containers

DESCRIPTOR: _descriptor.FileDescriptor

class UpsertRecordRequest(_message.Message):
    __slots__ = ("user_id", "date", "metrics")
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    DATE_FIELD_NUMBER: _ClassVar[int]
    METRICS_FIELD_NUMBER: _ClassVar[int]
    user_id: str
    date: _timestamp_pb2.Timestamp
    metrics: Metrics
    def __init__(
        self,
        user_id: _Optional[str] = ...,
        date: _Optional[
            _Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]
        ] = ...,
        metrics: _Optional[_Union[Metrics, _Mapping]] = ...,
    ) -> None: ...

class Metrics(_message.Message):
    __slots__ = ("mood", "sleep_hours", "activity", "stress", "energy", "focus")
    MOOD_FIELD_NUMBER: _ClassVar[int]
    SLEEP_HOURS_FIELD_NUMBER: _ClassVar[int]
    ACTIVITY_FIELD_NUMBER: _ClassVar[int]
    STRESS_FIELD_NUMBER: _ClassVar[int]
    ENERGY_FIELD_NUMBER: _ClassVar[int]
    FOCUS_FIELD_NUMBER: _ClassVar[int]
    mood: int
    sleep_hours: float
    activity: int
    stress: int
    energy: int
    focus: int
    def __init__(
        self,
        mood: _Optional[int] = ...,
        sleep_hours: _Optional[float] = ...,
        activity: _Optional[int] = ...,
        stress: _Optional[int] = ...,
        energy: _Optional[int] = ...,
        focus: _Optional[int] = ...,
    ) -> None: ...

class Month(_message.Message):
    __slots__ = ("user_id", "year", "month")
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    YEAR_FIELD_NUMBER: _ClassVar[int]
    MONTH_FIELD_NUMBER: _ClassVar[int]
    user_id: str
    year: int
    month: int
    def __init__(
        self,
        user_id: _Optional[str] = ...,
        year: _Optional[int] = ...,
        month: _Optional[int] = ...,
    ) -> None: ...

class RecordListResponse(_message.Message):
    __slots__ = ("records",)
    RECORDS_FIELD_NUMBER: _ClassVar[int]
    records: _containers.RepeatedCompositeFieldContainer[RecordInfo]
    def __init__(
        self, records: _Optional[_Iterable[_Union[RecordInfo, _Mapping]]] = ...
    ) -> None: ...

class RecordInfo(_message.Message):
    __slots__ = ("date", "metrics")
    DATE_FIELD_NUMBER: _ClassVar[int]
    METRICS_FIELD_NUMBER: _ClassVar[int]
    date: _timestamp_pb2.Timestamp
    metrics: Metrics
    def __init__(
        self,
        date: _Optional[
            _Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]
        ] = ...,
        metrics: _Optional[_Union[Metrics, _Mapping]] = ...,
    ) -> None: ...

class UserId(_message.Message):
    __slots__ = ("user_id",)
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    user_id: str
    def __init__(self, user_id: _Optional[str] = ...) -> None: ...

class DashboardRequest(_message.Message):
    __slots__ = ("user_id", "client_date")
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    CLIENT_DATE_FIELD_NUMBER: _ClassVar[int]
    user_id: str
    client_date: _timestamp_pb2.Timestamp
    def __init__(
        self,
        user_id: _Optional[str] = ...,
        client_date: _Optional[
            _Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]
        ] = ...,
    ) -> None: ...

class DashboardResponse(_message.Message):
    __slots__ = ("today", "week")
    class WeeklyAverages(_message.Message):
        __slots__ = (
            "mood",
            "sleep_hours",
            "activity",
            "stress",
            "energy",
            "focus",
            "changes",
        )
        class ChangesEntry(_message.Message):
            __slots__ = ("key", "value")
            KEY_FIELD_NUMBER: _ClassVar[int]
            VALUE_FIELD_NUMBER: _ClassVar[int]
            key: str
            value: float
            def __init__(
                self, key: _Optional[str] = ..., value: _Optional[float] = ...
            ) -> None: ...

        MOOD_FIELD_NUMBER: _ClassVar[int]
        SLEEP_HOURS_FIELD_NUMBER: _ClassVar[int]
        ACTIVITY_FIELD_NUMBER: _ClassVar[int]
        STRESS_FIELD_NUMBER: _ClassVar[int]
        ENERGY_FIELD_NUMBER: _ClassVar[int]
        FOCUS_FIELD_NUMBER: _ClassVar[int]
        CHANGES_FIELD_NUMBER: _ClassVar[int]
        mood: float
        sleep_hours: float
        activity: float
        stress: float
        energy: float
        focus: float
        changes: _containers.ScalarMap[str, float]
        def __init__(
            self,
            mood: _Optional[float] = ...,
            sleep_hours: _Optional[float] = ...,
            activity: _Optional[float] = ...,
            stress: _Optional[float] = ...,
            energy: _Optional[float] = ...,
            focus: _Optional[float] = ...,
            changes: _Optional[_Mapping[str, float]] = ...,
        ) -> None: ...

    TODAY_FIELD_NUMBER: _ClassVar[int]
    WEEK_FIELD_NUMBER: _ClassVar[int]
    today: Metrics
    week: DashboardResponse.WeeklyAverages
    def __init__(
        self,
        today: _Optional[_Union[Metrics, _Mapping]] = ...,
        week: _Optional[_Union[DashboardResponse.WeeklyAverages, _Mapping]] = ...,
    ) -> None: ...

class AnalyticsResponse(_message.Message):
    __slots__ = ("analytics",)
    class PeriodAnalytics(_message.Message):
        __slots__ = ("period", "feature_importance", "insights", "generated_at")
        PERIOD_FIELD_NUMBER: _ClassVar[int]
        FEATURE_IMPORTANCE_FIELD_NUMBER: _ClassVar[int]
        INSIGHTS_FIELD_NUMBER: _ClassVar[int]
        GENERATED_AT_FIELD_NUMBER: _ClassVar[int]
        period: str
        feature_importance: AnalyticsResponse.FeatureImportance
        insights: _containers.RepeatedCompositeFieldContainer[ActionItem]
        generated_at: _timestamp_pb2.Timestamp
        def __init__(
            self,
            period: _Optional[str] = ...,
            feature_importance: _Optional[
                _Union[AnalyticsResponse.FeatureImportance, _Mapping]
            ] = ...,
            insights: _Optional[_Iterable[_Union[ActionItem, _Mapping]]] = ...,
            generated_at: _Optional[
                _Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]
            ] = ...,
        ) -> None: ...

    class FeatureImportance(_message.Message):
        __slots__ = ("sleep_hours", "activity", "stress", "energy", "focus")
        SLEEP_HOURS_FIELD_NUMBER: _ClassVar[int]
        ACTIVITY_FIELD_NUMBER: _ClassVar[int]
        STRESS_FIELD_NUMBER: _ClassVar[int]
        ENERGY_FIELD_NUMBER: _ClassVar[int]
        FOCUS_FIELD_NUMBER: _ClassVar[int]
        sleep_hours: float
        activity: float
        stress: float
        energy: float
        focus: float
        def __init__(
            self,
            sleep_hours: _Optional[float] = ...,
            activity: _Optional[float] = ...,
            stress: _Optional[float] = ...,
            energy: _Optional[float] = ...,
            focus: _Optional[float] = ...,
        ) -> None: ...

    ANALYTICS_FIELD_NUMBER: _ClassVar[int]
    analytics: _containers.RepeatedCompositeFieldContainer[
        AnalyticsResponse.PeriodAnalytics
    ]
    def __init__(
        self,
        analytics: _Optional[
            _Iterable[_Union[AnalyticsResponse.PeriodAnalytics, _Mapping]]
        ] = ...,
    ) -> None: ...

class ActionItem(_message.Message):
    __slots__ = ("key", "parameters", "priority")
    class ParametersEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: float
        def __init__(
            self, key: _Optional[str] = ..., value: _Optional[float] = ...
        ) -> None: ...

    KEY_FIELD_NUMBER: _ClassVar[int]
    PARAMETERS_FIELD_NUMBER: _ClassVar[int]
    PRIORITY_FIELD_NUMBER: _ClassVar[int]
    key: str
    parameters: _containers.ScalarMap[str, float]
    priority: str
    def __init__(
        self,
        key: _Optional[str] = ...,
        parameters: _Optional[_Mapping[str, float]] = ...,
        priority: _Optional[str] = ...,
    ) -> None: ...

class RecommendationsResponse(_message.Message):
    __slots__ = ("recommendations", "generated_at")
    RECOMMENDATIONS_FIELD_NUMBER: _ClassVar[int]
    GENERATED_AT_FIELD_NUMBER: _ClassVar[int]
    recommendations: _containers.RepeatedCompositeFieldContainer[ActionItem]
    generated_at: _timestamp_pb2.Timestamp
    def __init__(
        self,
        recommendations: _Optional[_Iterable[_Union[ActionItem, _Mapping]]] = ...,
        generated_at: _Optional[
            _Union[datetime.datetime, _timestamp_pb2.Timestamp, _Mapping]
        ] = ...,
    ) -> None: ...
