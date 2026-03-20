from typing import cast

from dto import response as response_dto
from enums import Insight

from .activity import generate_activity_recommendations
from .energy import generate_energy_recommendations
from .feature_importance import generate_feature_importance_recommendations
from .focus import generate_focus_recommendations
from .general import generate_general_recommendations
from .mood import generate_mood_recommendations
from .preventive import generate_preventive_recommendations
from .sleep import generate_sleep_recommendations
from .stress import generate_stress_recommendations


def generate_recommendations(
    week_analytcis: response_dto.PeriodAnalyticsResponseDTO | None,
    month_analytcis: response_dto.PeriodAnalyticsResponseDTO | None,
) -> list[response_dto.ActionItemResponseDTO]:
    week_analytcis_insights = week_analytcis.insights if week_analytcis else []
    month_analytcis_insights = month_analytcis.insights if month_analytcis else []

    week_insights = {
        cast(Insight, i.key): i.parameters for i in week_analytcis_insights
    }
    month_insights = {
        cast(Insight, i.key): i.parameters for i in month_analytcis_insights
    }

    recommendations = []
    recommendations.extend(generate_mood_recommendations(week_insights, month_insights))
    recommendations.extend(
        generate_sleep_recommendations(week_insights, month_insights)
    )
    recommendations.extend(
        generate_activity_recommendations(week_insights, month_insights)
    )
    recommendations.extend(
        generate_stress_recommendations(week_insights, month_insights)
    )
    recommendations.extend(
        generate_energy_recommendations(week_insights, month_insights)
    )
    recommendations.extend(
        generate_focus_recommendations(week_insights, month_insights)
    )
    recommendations.extend(
        generate_general_recommendations(week_insights, month_insights)
    )
    if month_analytcis:
        recommendations.extend(
            generate_feature_importance_recommendations(
                month_analytcis.feature_importance
            )
        )
    recommendations.extend(generate_preventive_recommendations(week_insights))
    return recommendations
