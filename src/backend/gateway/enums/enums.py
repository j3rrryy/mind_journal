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
    # MOOD
    LOW_MOOD = "low_mood"
    HIGH_MOOD = "high_mood"
    MOOD_TREND_UP = "mood_trend_up"
    MOOD_TREND_DOWN = "mood_trend_down"
    MOOD_STABLE = "mood_stable"
    MOOD_ABOVE_AVG = "mood_above_avg"
    MOOD_BELOW_AVG = "mood_below_avg"
    UNUSUAL_HIGH_MOOD = "unusual_high_mood"
    UNUSUAL_LOW_MOOD = "unusual_low_mood"
    MOOD_EXPECTED_UP = "mood_expected_up"
    MOOD_EXPECTED_DOWN = "mood_expected_down"
    MOOD_EXPECTED_STABLE = "mood_expected_stable"

    # SLEEP
    LOW_SLEEP = "low_sleep"
    HIGH_SLEEP = "high_sleep"
    IRREGULAR_SLEEP = "irregular_sleep"
    SLEEP_TREND_UP = "sleep_trend_up"
    SLEEP_TREND_DOWN = "sleep_trend_down"
    SLEEP_STABLE = "sleep_stable"
    SLEEP_ABOVE_AVG = "sleep_above_avg"
    SLEEP_BELOW_AVG = "sleep_below_avg"
    UNUSUAL_HIGH_SLEEP = "unusual_high_sleep"
    UNUSUAL_LOW_SLEEP = "unusual_low_sleep"

    # ACTIVITY
    LOW_ACTIVITY = "low_activity"
    HIGH_ACTIVITY = "high_activity"
    ACTIVITY_TREND_UP = "activity_trend_up"
    ACTIVITY_TREND_DOWN = "activity_trend_down"
    ACTIVITY_STABLE = "activity_stable"
    ACTIVITY_ABOVE_AVG = "activity_above_avg"
    ACTIVITY_BELOW_AVG = "activity_below_avg"
    UNUSUAL_HIGH_ACTIVITY = "unusual_high_activity"
    UNUSUAL_LOW_ACTIVITY = "unusual_low_activity"

    # STRESS
    HIGH_STRESS = "high_stress"
    LOW_STRESS = "low_stress"
    STRESS_TREND_UP = "stress_trend_up"
    STRESS_TREND_DOWN = "stress_trend_down"
    STRESS_STABLE = "stress_stable"
    STRESS_ABOVE_AVG = "stress_above_avg"
    STRESS_BELOW_AVG = "stress_below_avg"
    UNUSUAL_HIGH_STRESS = "unusual_high_stress"
    UNUSUAL_LOW_STRESS = "unusual_low_stress"
    STRESS_EXPECTED_UP = "stress_expected_up"
    STRESS_EXPECTED_DOWN = "stress_expected_down"

    # ENERGY
    LOW_ENERGY = "low_energy"
    HIGH_ENERGY = "high_energy"
    ENERGY_TREND_UP = "energy_trend_up"
    ENERGY_TREND_DOWN = "energy_trend_down"
    ENERGY_STABLE = "energy_stable"
    ENERGY_ABOVE_AVG = "energy_above_avg"
    ENERGY_BELOW_AVG = "energy_below_avg"
    UNUSUAL_HIGH_ENERGY = "unusual_high_energy"
    UNUSUAL_LOW_ENERGY = "unusual_low_energy"
    ENERGY_EXPECTED_UP = "energy_expected_up"
    ENERGY_EXPECTED_DOWN = "energy_expected_down"

    # FOCUS
    LOW_FOCUS = "low_focus"
    HIGH_FOCUS = "high_focus"
    FOCUS_TREND_UP = "focus_trend_up"
    FOCUS_TREND_DOWN = "focus_trend_down"
    FOCUS_STABLE = "focus_stable"
    FOCUS_ABOVE_AVG = "focus_above_avg"
    FOCUS_BELOW_AVG = "focus_below_avg"
    UNUSUAL_HIGH_FOCUS = "unusual_high_focus"
    UNUSUAL_LOW_FOCUS = "unusual_low_focus"


class Recommendation(str, Enum):
    RECOMMENDATION = "recommendation"


class MailType(Enum):
    EMAIL_CONFIRMATION = 0
    NEW_LOGIN = 1
    PASSWORD_RESET = 2
