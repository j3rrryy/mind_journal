from dramatiq import Broker, MessageProxy, Middleware, Worker
from dramatiq.asyncio import async_to_sync

from factories import ServiceFactory

from .scheduler import DramatiqScheduler


class DependencyMiddleware(Middleware):
    def __init__(self, service_factory: ServiceFactory, scheduler: DramatiqScheduler):
        self._service_factory = service_factory
        self._scheduler = scheduler

    def after_worker_boot(self, broker: Broker, worker: Worker) -> None:
        async_to_sync(self._service_factory.initialize)()
        self._scheduler.start()

    def before_worker_shutdown(self, broker: Broker, worker: Worker) -> None:
        self._scheduler.shutdown()
        async_to_sync(self._service_factory.close)()

    def before_process_message(self, broker: Broker, message: MessageProxy) -> None:
        message.options["wellness_repository"] = (
            self._service_factory.get_wellness_repository()
        )
        message.options["cache"] = self._service_factory.get_cache()
