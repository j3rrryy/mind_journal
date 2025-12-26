from enum import Enum


class Metric(Enum):
    MOOD = 0
    SLEEP_HOURS = 1
    ACTIVITY = 2
    STRESS = 3
    ENERGY = 4
    FOCUS = 5


class Period(Enum):
    WEEK = 0
    MONTH = 1
    QUARTER = 2
    HALF_YEAR = 3
    YEAR = 4


class Priority(Enum):
    HIGH = 0
    MEDIUM = 1
    LOW = 2


class Insight(Enum):
    INSIGHT = 0


class Recommendation(Enum):
    RECOMMENDATION = 1
