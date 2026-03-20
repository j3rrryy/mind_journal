from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_activity_recommendations(
    week_insights: dict[Insight, dict[str, float]],
    month_insights: dict[Insight, dict[str, float]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if Insight.LOW_ACTIVITY in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.TAKE_WALK,
                week_insights.get(Insight.LOW_ACTIVITY, {}),
                Priority.HIGH,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.LIGHT_EXERCISE,
                week_insights.get(Insight.LOW_ACTIVITY, {}),
                Priority.MEDIUM,
            )
        )
    elif Insight.ACTIVITY_TREND_DOWN in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.STRETCHING,
                month_insights.get(Insight.ACTIVITY_TREND_DOWN, {}),
                Priority.MEDIUM,
            )
        )

    if Insight.HIGH_ACTIVITY in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                week_insights.get(Insight.HIGH_ACTIVITY, {}),
                Priority.LOW,
            )
        )
    elif Insight.ACTIVITY_TREND_UP in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                month_insights.get(Insight.ACTIVITY_TREND_UP, {}),
                Priority.LOW,
            )
        )
    elif Insight.ACTIVITY_STABLE in month_insights and not recommendations:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.ACTIVITY_STABLE, {}),
                Priority.LOW,
            )
        )

    return recommendations
