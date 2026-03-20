from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_stress_recommendations(
    week_insights: dict[Insight, dict[str, float]],
    month_insights: dict[Insight, dict[str, float]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if Insight.HIGH_STRESS in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.BREATHING_EXERCISE,
                week_insights.get(Insight.HIGH_STRESS, {}),
                Priority.HIGH,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MEDITATION,
                week_insights.get(Insight.HIGH_STRESS, {}),
                Priority.MEDIUM,
            )
        )
    elif Insight.STRESS_TREND_UP in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MINDFULNESS,
                month_insights.get(Insight.STRESS_TREND_UP, {}),
                Priority.MEDIUM,
            )
        )

    if Insight.LOW_STRESS in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                week_insights.get(Insight.LOW_STRESS, {}),
                Priority.LOW,
            )
        )
    elif Insight.STRESS_TREND_DOWN in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                month_insights.get(Insight.STRESS_TREND_DOWN, {}),
                Priority.LOW,
            )
        )
    elif Insight.STRESS_STABLE in month_insights and not recommendations:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.STRESS_STABLE, {}),
                Priority.LOW,
            )
        )

    return recommendations
