import numpy as np

from dto import response as response_dto
from enums import Insight, Priority


def generate_basic_insights(
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
    avg_mood, avg_sleep, avg_activity, avg_stress, avg_energy, avg_focus = map(
        float, np.mean(metrics, axis=0)
    )
    insights = []

    if avg_mood < 4:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.LOW_MOOD,
                {"avg": round(avg_mood, 1), "target": 7},
                Priority.HIGH,
            )
        )
    elif avg_mood >= 7:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.HIGH_MOOD, {"avg": round(avg_mood, 1)}, Priority.LOW
            )
        )

    if avg_sleep < 6:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.LOW_SLEEP,
                {"avg": round(avg_sleep, 1), "target": 7.5},
                Priority.HIGH,
            )
        )
    elif avg_sleep > 12:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.HIGH_SLEEP,
                {"avg": round(avg_sleep, 1), "target": 7.5},
                Priority.HIGH,
            )
        )
    if len(records) >= 5:
        sleep_std = float(np.std(metrics[:, 1], ddof=1))
        if sleep_std > 2:
            insights.append(
                response_dto.ActionItemResponseDTO(
                    Insight.IRREGULAR_SLEEP, {}, Priority.MEDIUM
                )
            )

    if avg_activity < 4:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.LOW_ACTIVITY,
                {"avg": round(avg_activity, 1), "target": 7},
                Priority.HIGH,
            )
        )
    elif avg_activity >= 7:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.HIGH_ACTIVITY, {"avg": round(avg_activity, 1)}, Priority.LOW
            )
        )

    if avg_stress > 7:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.HIGH_STRESS,
                {"avg": round(avg_stress, 1), "target": 4},
                Priority.HIGH,
            )
        )
    elif avg_stress <= 4:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.LOW_STRESS, {"avg": round(avg_stress, 1)}, Priority.LOW
            )
        )

    if avg_energy < 4:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.LOW_ENERGY,
                {"avg": round(avg_energy, 1), "target": 7},
                Priority.HIGH,
            )
        )
    elif avg_energy >= 7:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.HIGH_ENERGY, {"avg": round(avg_energy, 1)}, Priority.LOW
            )
        )

    if avg_focus < 4:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.LOW_FOCUS,
                {"avg": round(avg_focus, 1), "target": 7},
                Priority.HIGH,
            )
        )
    elif avg_focus >= 7:
        insights.append(
            response_dto.ActionItemResponseDTO(
                Insight.HIGH_FOCUS, {"avg": round(avg_focus, 1)}, Priority.LOW
            )
        )

    return insights
