from dataclasses import asdict, dataclass
from typing import Type, TypeVar

from google.protobuf.message import Message
from google.protobuf.timestamp_pb2 import Timestamp
from sqlalchemy.orm import DeclarativeBase

Request = TypeVar("Request", bound="BaseRequestDTO")
Response = TypeVar("Response", bound="BaseResponseDTO")
Model = TypeVar("Model", bound=DeclarativeBase)
GrpcMessage = TypeVar("GrpcMessage", bound=Message)


@dataclass(slots=True, frozen=True)
class BaseRequestDTO:
    @classmethod
    def from_request(cls: Type[Request], request: Message) -> Request:
        fields = []
        for f in cls.__dataclass_fields__.keys():
            field = getattr(request, f)
            if isinstance(field, Timestamp):
                field = field.ToDatetime()
            fields.append(field)
        return cls(*fields)

    def to_model(self, model: type[Model]) -> Model:
        return model(**asdict(self))


@dataclass(slots=True, frozen=True)
class BaseResponseDTO:
    @classmethod
    def from_model(cls: Type[Response], model: DeclarativeBase) -> Response:
        return cls(*(getattr(model, f) for f in cls.__dataclass_fields__.keys()))

    def to_response(self, message: Type[GrpcMessage]) -> GrpcMessage:
        fields = {f.name: getattr(self, f.name) for f in message.DESCRIPTOR.fields}
        return message(**fields)


@dataclass(slots=True, frozen=True)
class MetricsDTO(BaseRequestDTO, BaseResponseDTO):
    mood: int
    sleep_hours: float
    activity: int
    stress: int
    energy: int
    focus: int
