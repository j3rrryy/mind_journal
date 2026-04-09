import numpy as np
from scipy import stats
from sklearn.ensemble import RandomForestRegressor

from dto import response as response_dto
from enums import AnalyticsLevel
from utils import get_model_params


def compute_feature_importance(
    records: list[response_dto.RecordInfoResponseDTO], level: AnalyticsLevel
) -> response_dto.FeatureImportanceResponseDTO:
    x = np.array(
        [
            [
                r.metrics.sleep_hours,
                r.metrics.activity,
                r.metrics.stress,
                r.metrics.energy,
                r.metrics.focus,
            ]
            for r in records
        ],
        dtype=np.float64,
    )
    y = np.array([r.metrics.mood for r in records], dtype=np.float64)

    match level:
        case AnalyticsLevel.BASIC | AnalyticsLevel.INTERMEDIATE:
            return _basic_importance(x, y)
        case AnalyticsLevel.ADVANCED:
            return _advanced_importance(x, y)


def _basic_importance(
    x: np.ndarray, y: np.ndarray
) -> response_dto.FeatureImportanceResponseDTO:
    correlations = []
    for i in range(5):
        corr = stats.pearsonr(x[:, i], y).correlation
        correlations.append(np.abs(corr) if not np.isnan(corr) else 0.0)

    total = sum(correlations)
    if total == 0:
        return response_dto.FeatureImportanceResponseDTO(0.2, 0.2, 0.2, 0.2, 0.2)

    normalized = [c / total for c in correlations]
    return response_dto.FeatureImportanceResponseDTO(
        normalized[0], normalized[1], normalized[2], normalized[3], normalized[4]
    )


def _advanced_importance(
    x: np.ndarray, y: np.ndarray
) -> response_dto.FeatureImportanceResponseDTO:
    n_estimators, max_depth = get_model_params(len(x))
    model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(x, y)
    importances = model.feature_importances_
    return response_dto.FeatureImportanceResponseDTO(
        float(importances[0]),
        float(importances[1]),
        float(importances[2]),
        float(importances[3]),
        float(importances[4]),
    )
