import datetime
from unittest.mock import MagicMock

import pytest
from litestar import Request
from litestar.exceptions import NotAuthorizedException, ValidationException

from utils import utc_today
from validators import validate_access_token, validate_date, validate_year_month_future

from ..mocks import ACCESS_TOKEN


@pytest.mark.parametrize(
    "header_value, expected_token, expected_exception, expected_message",
    [
        (f"Bearer {ACCESS_TOKEN}", ACCESS_TOKEN, None, None),
        (None, None, NotAuthorizedException, "Token is missing"),
        (
            f"Aearer {ACCESS_TOKEN}",
            None,
            NotAuthorizedException,
            "Invalid token format",
        ),
        ("Bearer", None, NotAuthorizedException, "Invalid token format"),
    ],
)
def test_validate_access_token(
    header_value, expected_token, expected_exception, expected_message
):
    mock_request = MagicMock(spec=Request)
    mock_request.headers.get.return_value = header_value

    if expected_exception and expected_message:
        with pytest.raises(expected_exception, match=expected_message):
            validate_access_token(mock_request)
    else:
        token = validate_access_token(mock_request)

        assert token == expected_token


def test_validate_date_past():
    with pytest.raises(ValidationException, match="Date is out of valid range"):
        validate_date(datetime.date(1999, 1, 1))


def test_validate_date_future():
    with pytest.raises(ValidationException, match="Date is out of valid range"):
        validate_date(utc_today() + datetime.timedelta(days=2))


def test_validate_year_month_future_year():
    date = utc_today() + datetime.timedelta(days=500)

    with pytest.raises(ValidationException, match="Year cannot be in the future"):
        validate_year_month_future(date.year, date.month)
