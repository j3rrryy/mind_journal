from unittest.mock import MagicMock

import pytest

from factories import ServiceFactory
from worker.container import container, get_cache, get_wellness_repository, initialize


@pytest.fixture(autouse=True)
def reset_container():
    container._factory = None
    yield


@pytest.fixture
def mock_service_factory(mocked_wellness_repository, cache):
    return MagicMock(
        spec=ServiceFactory,
        get_wellness_repository=lambda: mocked_wellness_repository,
        get_cache=lambda: cache,
    )


def test_get_wellness_repository(mock_service_factory, mocked_wellness_repository):
    initialize(mock_service_factory)

    wellness_repository = get_wellness_repository()

    assert wellness_repository == mocked_wellness_repository


def test_get_wellness_repository_not_initialized():
    with pytest.raises(RuntimeError, match="Container not initialized"):
        get_wellness_repository()


def test_get_cache(mock_service_factory, cache):
    initialize(mock_service_factory)

    cache_resp = get_cache()

    assert cache_resp == cache


def test_get_cache_not_initialized():
    with pytest.raises(RuntimeError, match="Container not initialized"):
        get_cache()
