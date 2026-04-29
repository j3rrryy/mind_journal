from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_sleep_recommendations(
    week_insights: dict[Insight, dict[str, str]],
    month_insights: dict[Insight, dict[str, str]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if Insight.LOW_SLEEP in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.IMPROVE_SLEEP_HYGIENE,
                week_insights.get(Insight.LOW_SLEEP, {}),
                Priority.HIGH,
            )
        )
    elif Insight.IRREGULAR_SLEEP in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FIXED_BEDTIME,
                week_insights.get(Insight.IRREGULAR_SLEEP, {}),
                Priority.MEDIUM,
            )
        )

    if Insight.SLEEP_TREND_DOWN in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FIXED_BEDTIME,
                month_insights.get(Insight.SLEEP_TREND_DOWN, {}),
                Priority.MEDIUM,
            )
        )
    elif Insight.SLEEP_TREND_UP in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.SLEEP_TREND_UP, {}),
                Priority.LOW,
            )
        )
    elif Insight.SLEEP_STABLE in month_insights and not recommendations:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.SLEEP_STABLE, {}),
                Priority.LOW,
            )
        )

    if Insight.HIGH_SLEEP in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.AVOID_SCREENS_BEFORE_BED,
                week_insights.get(Insight.HIGH_SLEEP, {}),
                Priority.LOW,
            )
        )

    return recommendations
