from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_focus_recommendations(
    week_insights: dict[Insight, dict[str, float]],
    month_insights: dict[Insight, dict[str, float]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if Insight.LOW_FOCUS in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.POMODORO_TECHNIQUE,
                week_insights.get(Insight.LOW_FOCUS, {}),
                Priority.HIGH,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.TAKE_BREAKS,
                week_insights.get(Insight.LOW_FOCUS, {}),
                Priority.MEDIUM,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MINIMIZE_DISTRACTIONS,
                week_insights.get(Insight.LOW_FOCUS, {}),
                Priority.MEDIUM,
            )
        )
    elif Insight.FOCUS_TREND_DOWN in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MINIMIZE_DISTRACTIONS,
                month_insights.get(Insight.FOCUS_TREND_DOWN, {}),
                Priority.MEDIUM,
            )
        )

    if Insight.HIGH_FOCUS in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                week_insights.get(Insight.HIGH_FOCUS, {}),
                Priority.LOW,
            )
        )
    elif Insight.FOCUS_TREND_UP in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                month_insights.get(Insight.FOCUS_TREND_UP, {}),
                Priority.LOW,
            )
        )
    elif Insight.FOCUS_STABLE in month_insights and not recommendations:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.FOCUS_STABLE, {}),
                Priority.LOW,
            )
        )

    return recommendations
