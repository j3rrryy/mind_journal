import asyncio

import dramatiq


@dramatiq.actor
async def test():
    print("test")
    await asyncio.sleep(1)
    print("test2")
