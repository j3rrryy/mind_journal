from dto import response as response_dto
from enums import Insight, Priority, Recommendation


def generate_energy_recommendations(
    week_insights: dict[Insight, dict[str, str]],
    month_insights: dict[Insight, dict[str, str]],
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if Insight.LOW_ENERGY in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.BOOST_ENERGY,
                week_insights.get(Insight.LOW_ENERGY, {}),
                Priority.HIGH,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.HYDRATION,
                week_insights.get(Insight.LOW_ENERGY, {}),
                Priority.MEDIUM,
            )
        )
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.POWER_NAP,
                week_insights.get(Insight.LOW_ENERGY, {}),
                Priority.LOW,
            )
        )
    elif Insight.ENERGY_TREND_DOWN in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.HYDRATION,
                month_insights.get(Insight.ENERGY_TREND_DOWN, {}),
                Priority.MEDIUM,
            )
        )

    if Insight.HIGH_ENERGY in week_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                week_insights.get(Insight.HIGH_ENERGY, {}),
                Priority.LOW,
            )
        )
    elif Insight.ENERGY_TREND_UP in month_insights:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.CONTINUE_POSITIVE_TREND,
                month_insights.get(Insight.ENERGY_TREND_UP, {}),
                Priority.LOW,
            )
        )
    elif Insight.ENERGY_STABLE in month_insights and not recommendations:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.MAINTAIN_GOOD_HABITS,
                month_insights.get(Insight.ENERGY_STABLE, {}),
                Priority.LOW,
            )
        )

    return recommendations
