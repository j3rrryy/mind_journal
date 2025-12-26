import datetime
from dataclasses import dataclass
from typing import Type, cast

from proto import wellness_pb2 as pb2

from .base import BaseRequestDTO, Message, MetricsDTO, Model


@dataclass(slots=True, frozen=True)
class UpsertRecordRequestDTO(BaseRequestDTO):
    user_id: str
    date: datetime.datetime
    metrics: MetricsDTO

    @classmethod
    def from_request(
        cls: Type["UpsertRecordRequestDTO"], request: Message
    ) -> "UpsertRecordRequestDTO":
        request = cast(pb2.UpsertRecordRequest, request)
        return cls(
            request.user_id,
            request.date.ToDatetime(),
            MetricsDTO.from_request(request.metrics),
        )

    def to_model(self, model: type[Model]) -> Model:
        return model(
            date=self.date.date(),
            user_id=self.user_id,
            mood=self.metrics.mood,
            sleep_hours=self.metrics.sleep_hours,
            activity=self.metrics.activity,
            stress=self.metrics.stress,
            energy=self.metrics.energy,
            focus=self.metrics.focus,
        )


@dataclass(slots=True, frozen=True)
class MonthRequestDTO(BaseRequestDTO):
    user_id: str
    year: int
    month: int
