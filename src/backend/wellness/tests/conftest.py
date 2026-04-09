from typing import Any

import pytest
from cashews import Cache
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from controller import WellnessController
from proto import WellnessServicer
from protocols import WellnessRepositoryProtocol, WellnessServiceProtocol
from repository import Record, WellnessRepository
from service import WellnessService

from .mocks import (
    create_cache,
    create_dashboard_row,
    create_record,
    create_session,
    create_sessionmaker,
    create_wellness_repository,
)


@pytest.fixture
def session() -> AsyncSession:
    return create_session()


@pytest.fixture
def sessionmaker(session) -> async_sessionmaker[AsyncSession]:
    return create_sessionmaker(session)


@pytest.fixture
def cache() -> Cache:
    return create_cache()


@pytest.fixture
def wellness_repository(sessionmaker) -> WellnessRepositoryProtocol:
    return WellnessRepository(sessionmaker)


@pytest.fixture
def mocked_wellness_repository() -> WellnessRepositoryProtocol:
    return create_wellness_repository()


@pytest.fixture
def wellness_service(mocked_wellness_repository, cache) -> WellnessServiceProtocol:
    return WellnessService(mocked_wellness_repository, cache)


@pytest.fixture
def wellness_controller(wellness_service) -> WellnessServicer:
    return WellnessController(wellness_service)


@pytest.fixture
def record() -> Record:
    return create_record()


@pytest.fixture
def dashboard_row() -> Any:
    return create_dashboard_row()
