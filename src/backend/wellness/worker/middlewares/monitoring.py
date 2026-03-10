import threading
from typing import Awaitable, Callable

from dramatiq import Broker, Worker
from dramatiq.asyncio import async_to_sync
from dramatiq.middleware.prometheus import Prometheus

from main import start_monitoring_server


class MonitoringMiddleware(Prometheus):
    def __init__(self, is_ready: Callable[[], Awaitable[bool]]):
        super().__init__()
        self._is_ready = is_ready

    @property
    def forks(self) -> list[Callable]:
        return []

    def after_worker_boot(self, broker: Broker, worker: Worker) -> None:
        thread = threading.Thread(
            target=lambda: async_to_sync(start_monitoring_server)(self._is_ready),
            daemon=True,
        )
        thread.start()
