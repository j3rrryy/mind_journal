from dto import response as response_dto
from enums import AnalyticsLevel

from .advanced import generate_advanced_insights
from .basic import generate_basic_insights
from .intermediate import generate_intermediate_insights


def generate_insights(
    records: list[response_dto.RecordInfoResponseDTO], level: AnalyticsLevel
) -> list[response_dto.ActionItemResponseDTO]:
    match level:
        case AnalyticsLevel.BASIC:
            return generate_basic_insights(records)
        case AnalyticsLevel.INTERMEDIATE:
            return generate_intermediate_insights(records)
        case AnalyticsLevel.ADVANCED:
            return generate_advanced_insights(records)
