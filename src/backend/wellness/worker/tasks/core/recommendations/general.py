from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_general_recommendations(
    week_insights: dict[Insight, dict[str, float]],
    month_insights: dict[Insight, dict[str, float]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if not week_insights and not month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS, {}, Priority.LOW
            )
        )
    elif not any(
        k in week_insights or k in month_insights
        for k in [
            Insight.LOW_MOOD,
            Insight.HIGH_STRESS,
            Insight.LOW_ENERGY,
            Insight.LOW_FOCUS,
            Insight.LOW_ACTIVITY,
            Insight.LOW_SLEEP,
        ]
    ):
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND, {}, Priority.LOW
            )
        )

    return recommendations
