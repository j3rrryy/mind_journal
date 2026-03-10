from cashews import Cache

from factories import ServiceFactory
from protocols import WellnessRepositoryProtocol

_factory: ServiceFactory | None = None


def initialize(factory: ServiceFactory) -> None:
    global _factory
    _factory = factory


def get_wellness_repository() -> WellnessRepositoryProtocol:
    if _factory is None:
        raise RuntimeError("Container not initialized")
    return _factory.get_wellness_repository()


def get_cache() -> Cache:
    if _factory is None:
        raise RuntimeError("Container not initialized")
    return _factory.get_cache()
