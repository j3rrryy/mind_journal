from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_mood_recommendations(
    week_insights: dict[Insight, dict[str, float]],
    month_insights: dict[Insight, dict[str, float]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if Insight.LOW_MOOD in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.DO_SOMETHING_FUN,
                week_insights.get(Insight.LOW_MOOD, {}),
                Priority.HIGH,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.SOCIAL_CONNECTION,
                week_insights.get(Insight.LOW_MOOD, {}),
                Priority.MEDIUM,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.GRATITUDE_PRACTICE,
                week_insights.get(Insight.LOW_MOOD, {}),
                Priority.MEDIUM,
            )
        )
    elif Insight.MOOD_TREND_DOWN in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.SOCIAL_CONNECTION,
                month_insights.get(Insight.MOOD_TREND_DOWN, {}),
                Priority.MEDIUM,
            )
        )

    if Insight.HIGH_MOOD in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                week_insights.get(Insight.HIGH_MOOD, {}),
                Priority.LOW,
            )
        )
    elif Insight.MOOD_TREND_UP in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                month_insights.get(Insight.MOOD_TREND_UP, {}),
                Priority.LOW,
            )
        )
    elif Insight.MOOD_STABLE in month_insights and not recommendations:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.MOOD_STABLE, {}),
                Priority.LOW,
            )
        )

    return recommendations
