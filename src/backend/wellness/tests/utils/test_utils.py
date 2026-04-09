from datetime import date, datetime

import pytest

from utils import (
    date_to_datetime,
    get_ml_model_params,
    get_month_range,
    utc_now_naive,
    utc_today,
)


def test_utc_now_naive():
    now = utc_now_naive()

    assert isinstance(now, datetime)
    assert now.tzinfo is None


def test_utc_today():
    today = utc_today()

    assert isinstance(today, date)
    assert today == utc_now_naive().date()


def test_date_to_datetime():
    dt = date(2000, 1, 1)

    dtime = date_to_datetime(dt)

    assert isinstance(dtime, datetime)
    assert dtime == datetime(2000, 1, 1, 0, 0, 0)


def test_get_month_range():
    start_date, end_date = get_month_range(2000, 1)

    assert start_date == date(2000, 1, 1)
    assert end_date == date(2000, 2, 1)


def test_get_month_range_next_year():
    start_date, end_date = get_month_range(2000, 12)

    assert start_date == date(2000, 12, 1)
    assert end_date == date(2001, 1, 1)


@pytest.mark.parametrize(
    "n_samples, exp_n_estimators, exp_max_depth",
    [(49, 30, 3), (99, 50, 5), (199, 100, 7), (200, 150, 10)],
)
def test_get_ml_model_params(n_samples, exp_n_estimators, exp_max_depth):
    n_estimators, max_depth = get_ml_model_params(n_samples)

    assert n_estimators == exp_n_estimators
    assert max_depth == exp_max_depth
