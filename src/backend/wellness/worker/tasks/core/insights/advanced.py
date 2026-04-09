import numpy as np
from scipy import stats
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.linear_model import LinearRegression

from dto import response as response_dto
from enums import Insight, Priority
from utils import get_ml_model_params


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
    insights.extend(_detect_anomalies(metrics))
    insights.extend(_predict_trends(metrics))
    insights.extend(_compare_with_average(metrics))
    return insights


def _detect_anomalies(
    metrics: np.ndarray,
) -> list[response_dto.ActionItemResponseDTO]:
    insights = []
    n = len(metrics)
    train_len = min(30, n)
    train_data = metrics[-train_len:]
    test_data = metrics[-7:]

    n_estimators, _ = get_ml_model_params(n)
    model = IsolationForest(
        n_estimators=n_estimators,
        contamination=min(0.2, max(0.05, 10.0 / n)),
        random_state=42,
        n_jobs=-1,
    )
    model.fit(train_data)

    preds = model.predict(test_data)
    anomaly_indices = np.where(preds == -1)[0]

    metric_config = [
        (
            0,
            Insight.UNUSUAL_HIGH_MOOD,
            Insight.UNUSUAL_LOW_MOOD,
            Priority.LOW,
            Priority.HIGH,
        ),
        (
            1,
            Insight.UNUSUAL_HIGH_SLEEP,
            Insight.UNUSUAL_LOW_SLEEP,
            Priority.LOW,
            Priority.HIGH,
        ),
        (
            2,
            Insight.UNUSUAL_HIGH_ACTIVITY,
            Insight.UNUSUAL_LOW_ACTIVITY,
            Priority.LOW,
            Priority.HIGH,
        ),
        (
            3,
            Insight.UNUSUAL_HIGH_STRESS,
            Insight.UNUSUAL_LOW_STRESS,
            Priority.HIGH,
            Priority.LOW,
        ),
        (
            4,
            Insight.UNUSUAL_HIGH_ENERGY,
            Insight.UNUSUAL_LOW_ENERGY,
            Priority.LOW,
            Priority.HIGH,
        ),
        (
            5,
            Insight.UNUSUAL_HIGH_FOCUS,
            Insight.UNUSUAL_LOW_FOCUS,
            Priority.LOW,
            Priority.HIGH,
        ),
    ]

    for idx in anomaly_indices:
        point = test_data[idx]
        medians = np.median(train_data, axis=0)
        for col, key_high, key_low, prio_high, prio_low in metric_config:
            if point[col] > medians[col] + 2:
                insights.append(
                    response_dto.ActionItemResponseDTO(
                        key_high,
                        {
                            "value": round(float(point[col]), 1),
                            "expected": round(float(medians[col]), 1),
                        },
                        prio_high,
                    )
                )
            elif point[col] < medians[col] - 2:
                insights.append(
                    response_dto.ActionItemResponseDTO(
                        key_low,
                        {
                            "value": round(float(point[col]), 1),
                            "expected": round(float(medians[col]), 1),
                        },
                        prio_low,
                    )
                )
    return insights


def _predict_trends(
    metrics: np.ndarray,
) -> list[response_dto.ActionItemResponseDTO]:
    insights = []
    n = len(metrics)
    x = np.arange(n).reshape(-1, 1).astype(np.float64)

    if n >= 50:
        n_estimators, max_depth = get_ml_model_params(n)
        model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        )
    else:
        model = LinearRegression(n_jobs=-1)

    trend_config = [
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
        (
            5,
            Insight.FOCUS_EXPECTED_UP,
            Insight.FOCUS_EXPECTED_DOWN,
            None,
            Priority.LOW,
            Priority.MEDIUM,
        ),
    ]

    for col, key_up, key_down, key_stable, up_priority, down_priority in trend_config:
        y = metrics[:, col]
        model.fit(x, y)
        pred = model.predict(np.array([[n], [n + 3]], dtype=np.float64))
        change = float(pred[1] - pred[0])

        if isinstance(model, LinearRegression):
            p_value = float(stats.pearsonr(x.flatten(), y).pvalue)  # type: ignore
            if p_value > 0.3 or abs(change) < 0.05 * np.std(y):
                if key_stable:
                    insights.append(
                        response_dto.ActionItemResponseDTO(key_stable, {}, Priority.LOW)
                    )
                continue
        else:
            if abs(change) < 0.1 * np.std(y):
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


def _compare_with_average(
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

        if effect_size > 0.3:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    key_above,
                    {
                        "recent": round(float(recent_avg[col]), 1),
                        "overall": round(float(overall_avg[col]), 1),
                    },
                    Priority.LOW if col != 3 else Priority.MEDIUM,
                )
            )
        elif effect_size < -0.3:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    key_below,
                    {
                        "recent": round(float(recent_avg[col]), 1),
                        "overall": round(float(overall_avg[col]), 1),
                    },
                    Priority.MEDIUM if col != 3 else Priority.LOW,
                )
            )
    return insights
