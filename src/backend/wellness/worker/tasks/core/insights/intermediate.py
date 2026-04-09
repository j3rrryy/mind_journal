import numpy as np
from scipy import stats

from dto import response as response_dto
from enums import Insight, Priority


def generate_intermediate_insights(
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
        ]
    )

    insights, trended_metrics = _analyze_trends(metrics)
    insights += _check_stability(metrics, trended_metrics)
    return insights


def _analyze_trends(
    metrics: np.ndarray,
) -> tuple[list[response_dto.ActionItemResponseDTO], set[int]]:
    n = metrics.shape[0]
    x = np.arange(n)
    weights = np.exp(-np.arange(n)[::-1] / max(n, 1))
    trended_metrics = set()
    insights = []

    trend_config = [
        (
            0,
            Insight.MOOD_TREND_UP,
            Insight.MOOD_TREND_DOWN,
            Priority.LOW,
            Priority.MEDIUM,
        ),
        (
            1,
            Insight.SLEEP_TREND_UP,
            Insight.SLEEP_TREND_DOWN,
            Priority.LOW,
            Priority.MEDIUM,
        ),
        (
            2,
            Insight.ACTIVITY_TREND_UP,
            Insight.ACTIVITY_TREND_DOWN,
            Priority.LOW,
            Priority.MEDIUM,
        ),
        (
            3,
            Insight.STRESS_TREND_UP,
            Insight.STRESS_TREND_DOWN,
            Priority.MEDIUM,
            Priority.LOW,
        ),
        (
            4,
            Insight.ENERGY_TREND_UP,
            Insight.ENERGY_TREND_DOWN,
            Priority.LOW,
            Priority.MEDIUM,
        ),
        (
            5,
            Insight.FOCUS_TREND_UP,
            Insight.FOCUS_TREND_DOWN,
            Priority.LOW,
            Priority.MEDIUM,
        ),
    ]

    for col, key_up, key_down, prio_up, prio_down in trend_config:
        slope_result = stats.linregress(x, metrics[:, col])
        slope = np.polyfit(x, metrics[:, col], 1, w=weights)[0]
        p_value = float(slope_result.pvalue)  # type: ignore
        total_change = slope * n

        min_val = np.min(metrics[:, col])
        max_val = np.max(metrics[:, col])
        if max_val > min_val:
            normalized_scale = max_val - min_val
        else:
            normalized_scale = 1.0

        relative_slope = abs(slope) * n / normalized_scale
        change_threshold = 0.08 * normalized_scale / n if normalized_scale > 0 else 0.08

        if p_value < 0.2 and relative_slope > 0.1:
            if slope > change_threshold:
                trended_metrics.add(col)
                insights.append(
                    response_dto.ActionItemResponseDTO(
                        key_up, {"change": round(total_change, 1)}, prio_up
                    )
                )
            elif slope < -change_threshold:
                trended_metrics.add(col)
                insights.append(
                    response_dto.ActionItemResponseDTO(
                        key_down, {"change": round(-total_change, 1)}, prio_down
                    )
                )
    return insights, trended_metrics


def _check_stability(
    metrics: np.ndarray, trended_metrics: set[int]
) -> list[response_dto.ActionItemResponseDTO]:
    insights = []
    stability_config = [
        (0, Insight.MOOD_STABLE),
        (1, Insight.SLEEP_STABLE),
        (2, Insight.ACTIVITY_STABLE),
        (3, Insight.STRESS_STABLE),
        (4, Insight.ENERGY_STABLE),
        (5, Insight.FOCUS_STABLE),
    ]

    for col, key in stability_config:
        if col in trended_metrics:
            continue

        mean_val = float(np.mean(metrics[:, col]))
        if mean_val == 0:
            continue

        std = float(np.std(metrics[:, col], ddof=1))
        cv = std / mean_val

        if cv < 0.15:
            insights.append(response_dto.ActionItemResponseDTO(key, {}, Priority.LOW))
    return insights
