import dramatiq
from dramatiq.brokers.redis import RedisBroker
from dramatiq.middleware import AsyncIO

from config import setup_logging
from factories import ServiceFactory
from settings import Settings

from .dependencies import DependencyMiddleware
from .monitoring import MonitoringMiddleware
from .scheduler import DramatiqScheduler

setup_logging()

broker = RedisBroker(
    username=Settings.REDIS_USER,
    password=Settings.REDIS_PASSWORD,
    host=Settings.REDIS_HOST,
    port=Settings.REDIS_PORT,
    db=Settings.REDIS_DB + 1,
)
dramatiq.set_broker(broker)
broker.add_middleware(AsyncIO())

scheduler = DramatiqScheduler()
service_factory = ServiceFactory()
broker.add_middleware(DependencyMiddleware(service_factory, scheduler))
broker.add_middleware(MonitoringMiddleware(service_factory.get_is_ready()))


from analytics import test  # noqa

scheduler.add_job(test, "* * * * *")
