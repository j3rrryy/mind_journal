from unittest.mock import MagicMock, patch

import pytest
from dramatiq import Broker, Worker

from factories import ServiceFactory
from worker.middlewares import DependencyMiddleware
from worker.scheduler import DramatiqScheduler


@pytest.fixture
def mock_service_factory():
    return MagicMock(spec=ServiceFactory)


@pytest.fixture
def mock_scheduler():
    return MagicMock(spec=DramatiqScheduler)


@pytest.fixture
def mock_broker():
    return MagicMock(spec=Broker)


@pytest.fixture
def mock_worker():
    return MagicMock(spec=Worker)


def test_init(mock_service_factory, mock_scheduler):
    with patch("worker.middlewares.dependencies.initialize") as mock_initialize:
        middleware = DependencyMiddleware(mock_service_factory, mock_scheduler)

        mock_initialize.assert_called_once_with(mock_service_factory)
        assert middleware._service_factory == mock_service_factory
        assert middleware._scheduler == mock_scheduler


def test_after_worker_boot(
    mock_service_factory, mock_scheduler, mock_broker, mock_worker
):
    with patch("worker.middlewares.dependencies.async_to_sync") as mock_async_to_sync:
        middleware = DependencyMiddleware(mock_service_factory, mock_scheduler)

        middleware.after_worker_boot(mock_broker, mock_worker)

        mock_async_to_sync.assert_any_call(mock_service_factory.initialize)
        mock_async_to_sync.assert_any_call(mock_service_factory.get_cache().init)
        mock_scheduler.start.assert_called_once()


def test_before_worker_shutdown(
    mock_service_factory, mock_scheduler, mock_broker, mock_worker
):
    with patch("worker.middlewares.dependencies.async_to_sync") as mock_async_to_sync:
        middleware = DependencyMiddleware(mock_service_factory, mock_scheduler)

        middleware.before_worker_shutdown(mock_broker, mock_worker)

        mock_scheduler.shutdown.assert_called_once()
        mock_async_to_sync.assert_called_once_with(mock_service_factory.close)
