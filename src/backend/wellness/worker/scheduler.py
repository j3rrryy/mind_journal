import importlib

from apscheduler.jobstores.redis import RedisJobStore
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dramatiq import Actor

from settings import Settings


class DramatiqScheduler:
    def __init__(self):
        jobstore = RedisJobStore(
            jobs_key="dramatiq_scheduler.jobs",
            run_times_key="dramatiq_scheduler.run_times",
            username=Settings.REDIS_USER,
            password=Settings.REDIS_PASSWORD,
            host=Settings.REDIS_HOST,
            port=Settings.REDIS_PORT,
            db=Settings.REDIS_DB + 2,
        )
        self._scheduler = BackgroundScheduler(
            jobstores={"default": jobstore}, timezone="UTC"
        )

    def add_job(self, func: Actor, cron_expr: str):
        module_name = func.fn.__module__
        function_name = func.fn.__name__
        func_path = f"{module_name}.{function_name}"
        self._scheduler.add_job(
            func=_execute,
            trigger=CronTrigger.from_crontab(cron_expr),
            kwargs={"func_path": func_path},
            id=func.fn.__name__,
            name=func.fn.__name__,
            replace_existing=True,
        )

    def start(self):
        if not self._scheduler.running:
            self._scheduler.start()

    def shutdown(self):
        if self._scheduler.running:
            self._scheduler.shutdown()


def _execute(func_path: str) -> None:
    module_path, func_name = func_path.rsplit(".", 1)
    module = importlib.import_module(module_path)
    actor = getattr(module, func_name)
    actor.send()
