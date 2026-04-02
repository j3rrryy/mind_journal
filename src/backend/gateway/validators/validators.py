import datetime

from litestar import Request
from litestar.exceptions import NotAuthorizedException, ValidationException

from utils import utc_today


def validate_access_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise NotAuthorizedException(detail="Token is missing")

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise NotAuthorizedException(detail="Invalid token format")

    return parts[1]


def validate_date(date: datetime.date) -> datetime.datetime:
    min_date = datetime.date(2000, 1, 1)
    max_date = utc_today() + datetime.timedelta(days=1)
    if not (min_date <= date <= max_date):
        raise ValidationException(detail="Date is out of valid range")
    return datetime.datetime.combine(date, datetime.time())


def validate_year_month_future(year: int, month: int) -> tuple[int, int]:
    max_date = utc_today() + datetime.timedelta(days=1)
    if year > max_date.year:
        raise ValidationException(detail="Year cannot be in the future")
    elif year == max_date.year and month > max_date.month:  # pragma: no cover
        raise ValidationException(detail="Month cannot be in the future")
    return year, month
