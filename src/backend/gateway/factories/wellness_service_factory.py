import asyncio

import grpc

from adapters import WellnessGrpcAdapter
from proto import WellnessStub
from protocols import WellnessServiceProtocol
from settings import Settings


class WellnessServiceFactory:
    def __init__(self):
        self._wellness_channel = None
        self._wellness_service = None

    async def initialize(self) -> None:
        try:
            await self._setup_wellness_service()
        except Exception:
            await self.close()
            raise

    async def close(self) -> None:
        if self._wellness_channel is not None:
            try:
                await self._wellness_channel.close()
            finally:
                self._wellness_channel = None
                self._wellness_service = None

    async def _setup_wellness_service(self) -> None:
        self._wellness_channel = grpc.aio.insecure_channel(
            Settings.WELLNESS_SERVICE, compression=grpc.Compression.Deflate
        )
        await asyncio.wait_for(
            self._wellness_channel.channel_ready(),
            timeout=Settings.GRPC_CHANNEL_READY_TIMEOUT,
        )
        stub = WellnessStub(self._wellness_channel)
        self._wellness_service = WellnessGrpcAdapter(stub)

    def get_wellness_service(self) -> WellnessServiceProtocol:
        if not self._wellness_service:
            raise RuntimeError("WellnessService not initialized")
        return self._wellness_service

    async def is_ready(self) -> bool:
        if not self._wellness_channel or not self._wellness_service:
            return False
        try:
            async with asyncio.timeout(1):
                await self._wellness_channel.channel_ready()
            return True
        except Exception:
            return False
