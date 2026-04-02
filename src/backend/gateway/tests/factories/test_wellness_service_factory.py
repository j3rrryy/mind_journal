from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from factories import WellnessServiceFactory


@pytest.mark.asyncio
async def test_wellness_service_factory_initialize_success():
    with (
        patch(
            "factories.wellness_service_factory.grpc.aio.insecure_channel"
        ) as mock_channel,
        patch("factories.wellness_service_factory.WellnessGrpcAdapter") as mock_adapter,
    ):
        factory = WellnessServiceFactory()
        mock_channel_instance = AsyncMock()
        mock_channel_instance.channel_ready = AsyncMock()
        mock_channel_instance.channel_ready.return_value = None
        mock_channel.return_value = mock_channel_instance
        mock_adapter_instance = MagicMock()
        mock_adapter.return_value = mock_adapter_instance

        await factory.initialize()

        assert factory._wellness_channel == mock_channel_instance
        assert factory._wellness_service == mock_adapter_instance


@pytest.mark.asyncio
async def test_wellness_service_factory_initialize_exception():
    factory = WellnessServiceFactory()
    with (
        patch(
            "factories.wellness_service_factory.grpc.aio.insecure_channel"
        ) as mock_channel,
        patch.object(factory, "close", new_callable=AsyncMock) as mock_close,
    ):
        mock_channel.return_value.channel_ready.side_effect = Exception(
            "Connection failed"
        )

        with pytest.raises(Exception):
            await factory.initialize()

        mock_close.assert_awaited_once()


@pytest.mark.asyncio
async def test_wellness_service_factory_close():
    factory = WellnessServiceFactory()
    mock_channel = AsyncMock()
    factory._wellness_channel = mock_channel

    await factory.close()

    mock_channel.close.assert_awaited_once()
    assert factory._wellness_channel is None
    assert factory._wellness_service is None


@pytest.mark.asyncio
async def test_wellness_service_factory_close_no_channel():
    factory = WellnessServiceFactory()

    await factory.close()

    assert factory._wellness_channel is None
    assert factory._wellness_service is None


def test_wellness_service_factory_get_wellness_service():
    factory = WellnessServiceFactory()
    mock_service = MagicMock()
    factory._wellness_service = mock_service

    result = factory.get_wellness_service()

    assert result == mock_service


def test_wellness_service_factory_get_wellness_service_not_initialized():
    factory = WellnessServiceFactory()

    with pytest.raises(RuntimeError, match="WellnessService not initialized"):
        factory.get_wellness_service()


@pytest.mark.asyncio
async def test_wellness_service_factory_is_ready_success():
    factory = WellnessServiceFactory()
    factory._wellness_channel = AsyncMock()
    factory._wellness_service = MagicMock()

    is_ready = await factory.is_ready()

    assert is_ready


@pytest.mark.asyncio
async def test_wellness_service_factory_is_ready_fail():
    factory = WellnessServiceFactory()
    factory._wellness_channel = AsyncMock()
    factory._wellness_service = MagicMock()
    factory._wellness_channel.channel_ready.side_effect = Exception("Connection failed")

    is_ready = await factory.is_ready()

    assert not is_ready


@pytest.mark.asyncio
async def test_wellness_service_factory_is_ready_not_initialized():
    factory = WellnessServiceFactory()

    is_ready = await factory.is_ready()

    assert not is_ready
