from dto import response as response_dto
from enums import Priority, Recommendation


def generate_feature_importance_recommendations(
    feature_importance: response_dto.FeatureImportanceResponseDTO,
) -> list[response_dto.ActionItemResponseDTO]:
    recommendations = []

    if feature_importance.sleep_hours > 0.3:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FOCUS_ON_SLEEP,
                {"importance": str(int(feature_importance.sleep_hours * 100))},
                Priority.MEDIUM,
            )
        )
    if feature_importance.activity > 0.3:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FOCUS_ON_ACTIVITY,
                {"importance": str(int(feature_importance.activity * 100))},
                Priority.MEDIUM,
            )
        )
    if feature_importance.stress > 0.3:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FOCUS_ON_STRESS,
                {"importance": str(int(feature_importance.stress * 100))},
                Priority.MEDIUM,
            )
        )
    if feature_importance.energy > 0.3:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FOCUS_ON_ENERGY,
                {"importance": str(int(feature_importance.energy * 100))},
                Priority.MEDIUM,
            )
        )
    if feature_importance.focus > 0.3:
        recommendations.append(
            response_dto.ActionItemResponseDTO(
                Recommendation.FOCUS_ON_FOCUS,
                {"importance": str(int(feature_importance.focus * 100))},
                Priority.MEDIUM,
            )
        )

    return recommendations
