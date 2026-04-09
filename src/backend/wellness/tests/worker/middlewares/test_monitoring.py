from typing import Awaitable, Callable
from unittest.mock import MagicMock, patch

import pytest
from dramatiq import Broker, Worker

from worker.middlewares.monitoring import MonitoringMiddleware


@pytest.fixture
def mock_is_ready():
    return MagicMock(spec=Callable[[], Awaitable[bool]])


@pytest.fixture
def mock_broker():
    return MagicMock(spec=Broker)


@pytest.fixture
def mock_worker():
    return MagicMock(spec=Worker)


def test_forks(mock_is_ready):
    middleware = MonitoringMiddleware(mock_is_ready)

    forks = middleware.forks

    assert forks == []


def test_after_worker_boot(mock_is_ready, mock_broker, mock_worker):
    with (
        patch("worker.middlewares.monitoring.threading.Thread") as mock_thread,
        patch("worker.middlewares.monitoring.async_to_sync") as mock_async_to_sync,
    ):
        mock_thread_instance = MagicMock()
        mock_thread.return_value = mock_thread_instance
        middleware = MonitoringMiddleware(mock_is_ready)

        middleware.after_worker_boot(mock_broker, mock_worker)

        mock_thread.call_args[1]["target"]()
        mock_async_to_sync.assert_called_once()
        mock_thread_instance.start.assert_called_once()
