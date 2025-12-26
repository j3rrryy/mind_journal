from typing import AsyncGenerator, Awaitable, Callable
from unittest.mock import AsyncMock

import pytest
import pytest_asyncio
from aiokafka import AIOKafkaProducer
from litestar import Litestar
from litestar.di import Provide
from litestar.exceptions import HTTPException
from litestar.testing import AsyncTestClient

from adapters import AuthGrpcAdapter, MailKafkaAdapter, WellnessGrpcAdapter
from controller import HealthController
from controller import v1 as controller_v1
from facades import ApplicationFacade, AuthFacade, WellnessFacade
from proto import AuthStub, WellnessStub
from protocols import (
    ApplicationFacadeProtocol,
    AuthFacadeProtocol,
    AuthServiceProtocol,
    MailServiceProtocol,
    WellnessFacadeProtocol,
    WellnessServiceProtocol,
)
from settings import Settings
from utils import exception_handler

from .mocks import create_auth_stub_v1, create_mail_producer, create_wellness_stub_v1


@pytest.fixture
def auth_stub_v1() -> AuthStub:
    return create_auth_stub_v1()


@pytest.fixture
def wellness_stub_v1() -> WellnessStub:
    return create_wellness_stub_v1()


@pytest.fixture
def producer() -> AIOKafkaProducer:
    return create_mail_producer()


@pytest.fixture
def auth_grpc_adapter(auth_stub_v1) -> AuthServiceProtocol:
    return AuthGrpcAdapter(auth_stub_v1)


@pytest.fixture
def wellness_grpc_adapter(wellness_stub_v1) -> WellnessServiceProtocol:
    return WellnessGrpcAdapter(wellness_stub_v1)


@pytest.fixture
def mail_kafka_adapter(producer) -> MailServiceProtocol:
    return MailKafkaAdapter(producer)


@pytest.fixture
def auth_facade(auth_grpc_adapter, mail_kafka_adapter) -> AuthFacadeProtocol:
    return AuthFacade(auth_grpc_adapter, mail_kafka_adapter)


@pytest.fixture
def wellness_facade(wellness_grpc_adapter) -> WellnessFacadeProtocol:
    return WellnessFacade(wellness_grpc_adapter)


@pytest.fixture
def application_facade(auth_facade, wellness_facade) -> ApplicationFacadeProtocol:
    return ApplicationFacade(auth_facade, wellness_facade)


@pytest.fixture
def is_ready() -> Callable[[], Awaitable[bool]]:
    return AsyncMock(spec=Callable[[], Awaitable[bool]], return_value=True)


@pytest.fixture
def app(is_ready, application_facade) -> Litestar:
    return Litestar(
        path="/api",
        route_handlers=(
            HealthController,
            controller_v1.auth_router,
            controller_v1.wellness_router,
        ),
        debug=Settings.DEBUG,
        exception_handlers={HTTPException: exception_handler},
        dependencies={
            "is_ready": Provide(lambda: is_ready, use_cache=True, sync_to_thread=False),
            "application_facade": Provide(
                lambda: application_facade, use_cache=True, sync_to_thread=False
            ),
        },
    )


@pytest_asyncio.fixture
async def client(app) -> AsyncGenerator[AsyncTestClient[Litestar], None]:
    async with AsyncTestClient(app) as client:
        yield client
