from dramatiq import Broker, Middleware, Worker
from dramatiq.asyncio import async_to_sync

from factories import ServiceFactory

from ..container import initialize
from ..scheduler import DramatiqScheduler


class DependencyMiddleware(Middleware):
    def __init__(self, service_factory: ServiceFactory, scheduler: DramatiqScheduler):
        self._service_factory = service_factory
        self._scheduler = scheduler
        initialize(self._service_factory)

    def after_worker_boot(self, broker: Broker, worker: Worker) -> None:
        async_to_sync(self._service_factory.initialize)()
        async_to_sync(self._service_factory.get_cache().init)()
        self._scheduler.start()

    def before_worker_shutdown(self, broker: Broker, worker: Worker) -> None:
        self._scheduler.shutdown()
        async_to_sync(self._service_factory.close)()
