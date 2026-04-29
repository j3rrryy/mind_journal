from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_preventive_recommendations(
    week_insights: dict[Insight, dict[str, str]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    burnout_risk = (
        Insight.HIGH_STRESS in week_insights
        and Insight.LOW_ENERGY in week_insights
        and Insight.LOW_SLEEP in week_insights
    )
    if burnout_risk:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.PREVENT_BURNOUT, {}, Priority.HIGH
            )
        )

    if Insight.LOW_ENERGY in week_insights or Insight.LOW_MOOD in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MORNING_SUNLIGHT, {}, Priority.LOW
            )
        )

    if Insight.IRREGULAR_SLEEP in week_insights or Insight.HIGH_STRESS in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.EVENING_WIND_DOWN, {}, Priority.MEDIUM
            )
        )

    return recommendations
