import asyncio
from typing import Awaitable, Callable

from cashews import Cache

from controller import WellnessController
from proto import WellnessServicer
from protocols import WellnessRepositoryProtocol
from service import WellnessService

from .cache_factory import CacheFactory
from .wellness_repository_factory import WellnessRepositoryFactory


class ServiceFactory:
    def __init__(self):
        self._wellness_repository_factory = WellnessRepositoryFactory()
        self._cache_factory = CacheFactory()
        self._wellness_controller = None

    async def initialize(self) -> None:
        try:
            await asyncio.gather(
                self._wellness_repository_factory.initialize(),
                self._cache_factory.initialize(),
            )
        except Exception:
            await self.close()
            raise

    async def close(self) -> None:
        await asyncio.gather(
            self._wellness_repository_factory.close(),
            self._cache_factory.close(),
            return_exceptions=True,
        )

    def get_wellness_repository(self) -> WellnessRepositoryProtocol:
        return self._wellness_repository_factory.get_wellness_repository()

    def get_cache(self) -> Cache:
        return self._cache_factory.get_cache()

    def get_wellness_controller(self) -> WellnessServicer:
        if not self._wellness_controller:
            wellness_service = WellnessService(
                self.get_wellness_repository(), self.get_cache()
            )
            self._wellness_controller = WellnessController(wellness_service)
        return self._wellness_controller

    def get_is_ready(self) -> Callable[[], Awaitable[bool]]:
        async def is_ready() -> bool:
            try:
                repository_ready, cache_ready = await asyncio.gather(
                    self._wellness_repository_factory.is_ready(),
                    self._cache_factory.is_ready(),
                )
                return repository_ready and cache_ready
            except Exception:
                return False

        return is_ready
