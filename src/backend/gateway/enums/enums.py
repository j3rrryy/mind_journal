from enum import Enum


class Metric(str, Enum):
    MOOD = "mood"
    SLEEP_HOURS = "sleep_hours"
    ACTIVITY = "activity"
    STRESS = "stress"
    ENERGY = "energy"
    FOCUS = "focus"


class Period(str, Enum):
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    HALF_YEAR = "half_year"
    YEAR = "year"


class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Insight(str, Enum):
    INSIGHT = "insight"


class Recommendation(str, Enum):
    RECOMMENDATION = "recommendation"


class MailType(Enum):
    EMAIL_CONFIRMATION = 0
    NEW_LOGIN = 1
    PASSWORD_RESET = 2
