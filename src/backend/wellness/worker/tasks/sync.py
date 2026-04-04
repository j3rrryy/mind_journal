import logging
import random
import time
from typing import cast

import dramatiq
from cashews.backends.redis.client_side import BcastClientSide

from settings import Settings
from utils import analytics_scheduler_key

from ..container import get_cache, get_wellness_repository

logger = logging.getLogger()


@dramatiq.actor(queue_name="user_scheduler")
async def sync_scheduler() -> None:
    wellness_repository, cache = get_wellness_repository(), get_cache()
    redis_client = cast(BcastClientSide, cache._backends[""])._client
    scheduler_key = analytics_scheduler_key()

    if await cache.is_locked(scheduler_key):
        return

    async with cache.lock(scheduler_key, 600, False):
        all_user_ids = set(await wellness_repository.get_all_user_ids())
        raw_cache_user_ids = await redis_client.zrange(scheduler_key, 0, -1)
        cache_user_ids = {user_id.decode() for user_id in raw_cache_user_ids}

        new_users = all_user_ids - cache_user_ids
        removed_users = cache_user_ids - all_user_ids

        if new_users:
            now = int(time.time())
            pipe = redis_client.pipeline()
            for user_id in new_users:
                random_offset = 0 if Settings.DEBUG else random.randint(0, 86400)
                pipe.zadd(scheduler_key, {user_id: now + random_offset})
            await pipe.execute()
            logger.info(f"Added {len(new_users)} new users to scheduler")

        if removed_users:
            await redis_client.zrem(scheduler_key, *removed_users)
            logger.info(f"Removed {len(removed_users)} inactive users from scheduler")
