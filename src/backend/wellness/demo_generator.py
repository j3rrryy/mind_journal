import argparse
import asyncio
import random
from datetime import date, datetime, timedelta

import numpy as np
from cashews import Cache
from sqlalchemy import select
from sqlalchemy.engine import URL
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from dto.base import MetricsDTO
from dto.request import UpsertRecordRequestDTO
from repository.models import Record
from repository.wellness_repository import WellnessRepository
from settings import Settings
from utils import user_all_keys


class DataGenerator:
    def __init__(self, pattern: str = "balanced", seed: int | None = None):
        if seed is not None:
            random.seed(seed)
            np.random.seed(seed)

        self.pattern = pattern
        self._init_pattern()

    def _init_pattern(self):
        if self.pattern == "calm":
            self.base_mood = 6.5
            self.base_stress = 4.0
            self.base_sleep = 8.0
            self.base_activity = 5.0
            self.base_energy = 6.0
            self.base_focus = 6.0
            self.mood_noise = 0.8
            self.stress_noise = 0.6
            self.trend_prob = 0.2
        elif self.pattern == "stressed":
            self.base_mood = 4.0
            self.base_stress = 7.0
            self.base_sleep = 6.0
            self.base_activity = 3.0
            self.base_energy = 3.5
            self.base_focus = 4.0
            self.mood_noise = 1.2
            self.stress_noise = 1.0
            self.trend_prob = 0.5
        elif self.pattern == "active":
            self.base_mood = 7.0
            self.base_stress = 3.0
            self.base_sleep = 7.0
            self.base_activity = 8.0
            self.base_energy = 7.5
            self.base_focus = 7.0
            self.mood_noise = 1.0
            self.stress_noise = 0.7
            self.trend_prob = 0.4
        else:
            self.base_mood = 5.5
            self.base_stress = 5.0
            self.base_sleep = 7.0
            self.base_activity = 5.0
            self.base_energy = 5.5
            self.base_focus = 5.5
            self.mood_noise = 1.5
            self.stress_noise = 1.2
            self.trend_prob = 0.3

        self.weekend_boost = 1.2
        self.anomaly_prob = 0.02
        self.seasonal_amplitude = 0.5

    def _apply_seasonal(self, day: int, value: float) -> float:
        seasonal = self.seasonal_amplitude * np.sin(2 * np.pi * day / 30.0)
        return value + seasonal

    def _maybe_anomaly(self, value: float, base: float) -> float:
        if random.random() < self.anomaly_prob:
            shift = random.choice([-1, 1]) * random.uniform(3.0, 5.0)
            return max(1, min(10, value + shift))
        return value

    def generate_daily(self, current_date: date, day_index: int) -> dict[str, float]:
        day_of_week = current_date.weekday()
        is_weekend = day_of_week >= 5

        mood = self.base_mood + random.gauss(0, self.mood_noise)
        stress = self.base_stress + random.gauss(0, self.stress_noise)
        sleep = self.base_sleep + random.gauss(0, 1.0)
        activity = self.base_activity + random.gauss(0, 1.5)
        energy = self.base_energy + random.gauss(0, 1.2)
        focus = self.base_focus + random.gauss(0, 1.2)

        if is_weekend:
            mood += self.weekend_boost
            sleep += 0.5
            activity += 1.0
            stress -= 0.5
            energy += 0.5
            focus += 0.5

        mood = self._apply_seasonal(day_index, mood)
        stress = self._apply_seasonal(day_index, stress)
        sleep = self._apply_seasonal(day_index, sleep)
        activity = self._apply_seasonal(day_index, activity)
        energy = self._apply_seasonal(day_index, energy)
        focus = self._apply_seasonal(day_index, focus)

        if sleep < 5.5:
            mood -= 1.0
            energy -= 1.0
            focus -= 0.5
            stress += 0.8
        if activity < 2.0:
            mood -= 0.5
            energy -= 0.5
        if stress > 8.0:
            mood -= 1.5
            energy -= 0.5
            focus -= 0.5

        mood = self._maybe_anomaly(mood, self.base_mood)
        stress = self._maybe_anomaly(stress, self.base_stress)
        sleep = self._maybe_anomaly(sleep, self.base_sleep)
        activity = self._maybe_anomaly(activity, self.base_activity)
        energy = self._maybe_anomaly(energy, self.base_energy)
        focus = self._maybe_anomaly(focus, self.base_focus)

        def clip(x):
            return max(1.0, min(10.0, x))

        return {
            "mood": round(clip(mood), 1),
            "sleep_hours": round(clip(sleep), 1),
            "activity": round(clip(activity), 1),
            "stress": round(clip(stress), 1),
            "energy": round(clip(energy), 1),
            "focus": round(clip(focus), 1),
        }


class TrendGenerator:
    def __init__(
        self, direction: str = "random", strength: float = 3.0, total_days: int = 547
    ):
        if direction == "up":
            self.direction = 1
        elif direction == "down":
            self.direction = -1
        else:
            self.direction = random.choice([-1, 1])

        self.strength = strength
        self.total_days = total_days

    def apply(self, day_index: int, metrics: dict[str, float]) -> dict[str, float]:
        trend_factor = self.direction * self.strength * (day_index / self.total_days)

        metrics["mood"] += trend_factor * 0.3
        metrics["energy"] += trend_factor * 0.2
        if self.direction > 0:
            metrics["stress"] -= trend_factor * 0.2
        else:
            metrics["stress"] += trend_factor * 0.2

        return metrics


async def clear_user_data(repo: WellnessRepository, user_id: str) -> None:
    await repo.delete_all(user_id)
    print(f"🗑️ Cleared existing data for user {user_id}")


async def generate_data(
    repo: WellnessRepository,
    cache: Cache,
    user_id: str,
    days: int,
    pattern: str,
    trend_dir: str,
    trend_strength: float,
    anomaly_prob: float,
    seed: int | None,
    clear: bool,
) -> None:
    if clear:
        await clear_user_data(repo, user_id)

    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days - 1)
    print(f"📅 Generating data from {start_date} to {end_date}")
    print(
        f"📊 Total days: {days}, pattern: {pattern}, trend: {trend_dir}, seed: {seed}"
    )

    generator = DataGenerator(pattern=pattern, seed=seed)
    generator.anomaly_prob = anomaly_prob
    trend = TrendGenerator(
        direction=trend_dir, strength=trend_strength, total_days=days
    )

    created = 0
    current_date = start_date

    while current_date <= end_date:
        day_index = (current_date - start_date).days
        metrics = generator.generate_daily(current_date, day_index)
        metrics = trend.apply(day_index, metrics)

        dto = UpsertRecordRequestDTO(
            user_id=user_id,
            date=datetime.combine(current_date, datetime.min.time()),
            metrics=MetricsDTO(
                mood=int(round(max(1.0, min(10.0, metrics["mood"])))),
                sleep_hours=float(max(0.0, min(24.0, metrics["sleep_hours"]))),
                activity=int(round(max(1.0, min(10.0, metrics["activity"])))),
                stress=int(round(max(1.0, min(10.0, metrics["stress"])))),
                energy=int(round(max(1.0, min(10.0, metrics["energy"])))),
                focus=int(round(max(1.0, min(10.0, metrics["focus"])))),
            ),
        )
        await repo.upsert_record(dto)
        created += 1

        if created % 50 == 0:
            print(f"✅ Created {created} records...")

        current_date += timedelta(days=1)

    await cache.delete_match(user_all_keys(user_id))
    print(f"\n🎉 Done! Created {created} records for user {user_id}")

    async with repo._sessionmaker() as session:
        result = await session.execute(
            select(Record).where(Record.user_id == user_id).order_by(Record.date)
        )
        records = result.scalars().all()
        if records:
            moods = [r.mood for r in records]
            print("\n📊 Statistics:")
            print(f"  Mood range: {min(moods):.1f} - {max(moods):.1f}")
            print(f"  Mood avg: {sum(moods) / len(moods):.1f}")
            print(f"  First date: {records[0].date}")
            print(f"  Last date: {records[-1].date}")


async def main():
    parser = argparse.ArgumentParser(description="Generate test data for analytics")
    parser.add_argument("--user_id", type=str, required=True, help="User ID")
    parser.add_argument(
        "--days", type=int, default=547, help="Number of days (default: 547)"
    )
    parser.add_argument("--clear", action="store_true", help="Clear existing data")
    parser.add_argument("--seed", type=int, default=None, help="Random seed")
    parser.add_argument(
        "--pattern",
        type=str,
        default="balanced",
        choices=["balanced", "calm", "stressed", "active"],
        help="Pattern of user behavior",
    )
    parser.add_argument(
        "--trend",
        type=str,
        default="random",
        choices=["up", "down", "none", "random"],
        help="Long-term trend direction",
    )
    parser.add_argument(
        "--trend-strength",
        type=float,
        default=3.0,
        help="Overall change over the period (1-5)",
    )
    parser.add_argument(
        "--anomaly-prob",
        type=float,
        default=0.02,
        help="Daily anomaly probability (0-0.1)",
    )

    args = parser.parse_args()

    url = URL.create(
        Settings.POSTGRES_DRIVER,
        Settings.POSTGRES_USER,
        Settings.POSTGRES_PASSWORD,
        Settings.POSTGRES_HOST,
        Settings.POSTGRES_PORT,
        Settings.POSTGRES_DB,
    )
    engine = create_async_engine(url)
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    repo = WellnessRepository(async_session)
    cache = Cache()
    cache.setup(
        f"redis://{Settings.REDIS_USER}:{Settings.REDIS_PASSWORD}@"
        + f"{Settings.REDIS_HOST}:{Settings.REDIS_PORT}/{Settings.REDIS_DB}",
        client_side=True,
    )

    await generate_data(
        repo=repo,
        cache=cache,
        user_id=args.user_id,
        days=args.days,
        pattern=args.pattern,
        trend_dir=args.trend,
        trend_strength=args.trend_strength,
        anomaly_prob=args.anomaly_prob,
        seed=args.seed,
        clear=args.clear,
    )


if __name__ == "__main__":
    asyncio.run(main())
