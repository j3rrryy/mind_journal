import numpy as np
from scipy import stats
from sklearn.linear_model import LinearRegression

from dto import response as response_dto
from enums import Insight, Priority


def generate_advanced_insights(
    records: list[response_dto.RecordInfoResponseDTO],
) -> list[response_dto.ActionItemResponseDTO]:
    metrics = np.array(
        [
            [
                r.metrics.mood,
                r.metrics.sleep_hours,
                r.metrics.activity,
                r.metrics.stress,
                r.metrics.energy,
                r.metrics.focus,
            ]
            for r in records
        ],
        dtype=np.float64,
    )

    insights = []
    insights.extend(_detect_anomalies_iqr(metrics))
    insights.extend(_predict_trends_adaptive(metrics))
    insights.extend(_compare_with_average_adaptive(metrics))
    return insights


def _detect_anomalies_iqr(
    metrics: np.ndarray,
) -> list[response_dto.ActionItemResponseDTO]:
    insights = []
    n = len(metrics)
    history_len = min(30, n)
    baseline = metrics[-history_len:]
    recent = metrics[-7:]

    for col, key_low, key_high, low_priority, high_priority in [
        (
            0,
            Insight.UNUSUAL_LOW_MOOD,
            Insight.UNUSUAL_HIGH_MOOD,
            Priority.HIGH,
            Priority.LOW,
        ),
        (
            3,
            Insight.UNUSUAL_LOW_STRESS,
            Insight.UNUSUAL_HIGH_STRESS,
            Priority.LOW,
            Priority.HIGH,
        ),
    ]:
        baseline_values = baseline[:, col]
        q1, q3 = np.percentile(baseline_values, [25, 75])
        iqr = q3 - q1
        if iqr == 0:
            continue

        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        recent_values = recent[:, col]
        for val in recent_values:
            if val < lower_bound or val > upper_bound:
                if val < lower_bound:
                    key = key_low
                    priority = low_priority
                else:
                    key = key_high
                    priority = high_priority
                insights.append(
                    response_dto.ActionItemResponseDTO(
                        key,
                        {
                            "value": round(float(val), 1),
                            "expected": round(float(np.median(baseline_values)), 1),
                        },
                        priority,
                    )
                )
    return insights


def _predict_trends_adaptive(
    metrics: np.ndarray,
) -> list[response_dto.ActionItemResponseDTO]:
    insights = []
    n = len(metrics)
    x = np.arange(n).reshape(-1, 1).astype(np.float64)

    for col, key_up, key_down, key_stable, up_priority, down_priority in [
        (
            0,
            Insight.MOOD_EXPECTED_UP,
            Insight.MOOD_EXPECTED_DOWN,
            Insight.MOOD_EXPECTED_STABLE,
            Priority.LOW,
            Priority.MEDIUM,
        ),
        (
            3,
            Insight.STRESS_EXPECTED_UP,
            Insight.STRESS_EXPECTED_DOWN,
            None,
            Priority.MEDIUM,
            Priority.LOW,
        ),
        (
            4,
            Insight.ENERGY_EXPECTED_UP,
            Insight.ENERGY_EXPECTED_DOWN,
            None,
            Priority.LOW,
            Priority.MEDIUM,
        ),
    ]:
        y = metrics[:, col]
        model = LinearRegression()
        model.fit(x, y)
        pred = model.predict(np.array([[n], [n + 3]], dtype=np.float64))
        change = float(pred[1] - pred[0])

        p_value = float(stats.pearsonr(x.flatten(), y).pvalue)  # type: ignore
        if p_value > 0.1 or abs(change) < 0.1 * np.std(y):
            if key_stable:
                insights.append(
                    response_dto.ActionItemResponseDTO(key_stable, {}, Priority.LOW)
                )
            continue

        if change > 0:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    key_up, {"change": round(change, 1)}, up_priority
                )
            )
        else:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    key_down, {"change": round(-change, 1)}, down_priority
                )
            )
    return insights


def _compare_with_average_adaptive(
    metrics: np.ndarray,
) -> list[response_dto.ActionItemResponseDTO]:
    insights = []

    recent = metrics[-7:]
    recent_avg = np.mean(recent, axis=0)
    overall_avg = np.mean(metrics, axis=0)
    overall_std = np.std(metrics, axis=0)

    comparisons = [
        (0, Insight.MOOD_ABOVE_AVG, Insight.MOOD_BELOW_AVG),
        (1, Insight.SLEEP_ABOVE_AVG, Insight.SLEEP_BELOW_AVG),
        (2, Insight.ACTIVITY_ABOVE_AVG, Insight.ACTIVITY_BELOW_AVG),
        (3, Insight.STRESS_ABOVE_AVG, Insight.STRESS_BELOW_AVG),
        (4, Insight.ENERGY_ABOVE_AVG, Insight.ENERGY_BELOW_AVG),
        (5, Insight.FOCUS_ABOVE_AVG, Insight.FOCUS_BELOW_AVG),
    ]

    for col, key_above, key_below in comparisons:
        diff = recent_avg[col] - overall_avg[col]
        if overall_std[col] == 0:
            continue
        effect_size = diff / overall_std[col]

        if effect_size > 0.5:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    key_above,
                    {
                        "diff": round(float(diff), 1),
                        "recent": round(float(recent_avg[col]), 1),
                        "overall": round(float(overall_avg[col]), 1),
                    },
                    Priority.LOW if col != 3 else Priority.MEDIUM,
                )
            )
        elif effect_size < -0.5:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    key_below,
                    {
                        "diff": round(float(-diff), 1),
                        "recent": round(float(recent_avg[col]), 1),
                        "overall": round(float(overall_avg[col]), 1),
                    },
                    Priority.MEDIUM if col != 3 else Priority.LOW,
                )
            )
    return insights
