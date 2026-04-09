from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest

from worker.scheduler import DramatiqScheduler, _execute


@pytest.fixture
def mock_background_scheduler_class():
    with patch("worker.scheduler.BackgroundScheduler") as mock:
        mock_instance = MagicMock()
        mock.return_value = mock_instance
        yield mock


@pytest.fixture
def mock_redis_jobstore_class():
    with patch("worker.scheduler.RedisJobStore") as mock:
        yield mock


def test_init(mock_redis_jobstore_class, mock_background_scheduler_class):
    scheduler = DramatiqScheduler()

    mock_redis_jobstore_class.assert_called_once()
    mock_background_scheduler_class.assert_called_once()
    assert scheduler._scheduler == mock_background_scheduler_class.return_value


def test_add_job(mock_background_scheduler_class):
    scheduler = DramatiqScheduler()
    actor = MagicMock()
    actor.fn = MagicMock()
    actor.fn.__module__ = "test_module"
    actor.fn.__name__ = "test_func"
    cron_expr = "* * * * *"

    scheduler.add_job(actor, cron_expr, run_immediately=False)

    mock_scheduler_instance = mock_background_scheduler_class.return_value
    mock_scheduler_instance.add_job.assert_called_once()
    call_kwargs = mock_scheduler_instance.add_job.call_args[1]
    assert call_kwargs["trigger"].__class__.__name__ == "CronTrigger"
    assert call_kwargs["kwargs"]["func_path"] == "test_module.test_func"
    assert "next_run_time" not in call_kwargs


def test_add_job_run_immediately(mock_background_scheduler_class):
    scheduler = DramatiqScheduler()
    actor = MagicMock()
    actor.fn = MagicMock()
    actor.fn.__module__ = "test_module"
    actor.fn.__name__ = "test_func"

    scheduler.add_job(actor, "* * * * *", True)

    mock_scheduler_instance = mock_background_scheduler_class.return_value
    call_kwargs = mock_scheduler_instance.add_job.call_args[1]
    assert "next_run_time" in call_kwargs
    assert isinstance(call_kwargs["next_run_time"], datetime)


def test_start(mock_background_scheduler_class):
    mock_scheduler_instance = mock_background_scheduler_class.return_value
    mock_scheduler_instance.running = False
    scheduler = DramatiqScheduler()

    scheduler.start()

    mock_scheduler_instance.start.assert_called_once()


def test_start_already_running(mock_background_scheduler_class):
    mock_scheduler_instance = mock_background_scheduler_class.return_value
    mock_scheduler_instance.running = True
    scheduler = DramatiqScheduler()

    scheduler.start()

    mock_scheduler_instance.start.assert_not_called()


def test_shutdown(mock_background_scheduler_class):
    mock_scheduler_instance = mock_background_scheduler_class.return_value
    mock_scheduler_instance.running = True
    scheduler = DramatiqScheduler()

    scheduler.shutdown()

    mock_scheduler_instance.shutdown.assert_called_once()


def test_shutdown_not_running(mock_background_scheduler_class):
    mock_scheduler_instance = mock_background_scheduler_class.return_value
    mock_scheduler_instance.running = False
    scheduler = DramatiqScheduler()

    scheduler.shutdown()

    mock_scheduler_instance.shutdown.assert_not_called()


def test_execute():
    with patch("worker.scheduler.importlib.import_module") as mock_import:
        mock_module = MagicMock()
        mock_actor = MagicMock()
        mock_module.test_func = mock_actor
        mock_import.return_value = mock_module

        _execute("test_module.test_func")

        mock_import.assert_called_once_with("test_module")
        mock_actor.send.assert_called_once()
