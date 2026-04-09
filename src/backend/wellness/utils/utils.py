import logging
from datetime import date, datetime, time, timezone
from functools import lru_cache, wraps
from typing import Awaitable, Callable

import grpc

from exceptions import BaseAppException, DatabaseException


class ExceptionInterceptor(grpc.aio.ServerInterceptor):  # pragma: no cover
    logger = logging.getLogger()

    async def intercept_service(
        self,
        continuation: Callable[
            [grpc.HandlerCallDetails], Awaitable[grpc.RpcMethodHandler]
        ],
        handler_call_details: grpc.HandlerCallDetails,
    ) -> grpc.RpcMethodHandler:
        handler = await continuation(handler_call_details)

        async def wrapper(request, context):
            try:
                return await handler.unary_unary(request, context)  # type: ignore
            except BaseAppException as exc:
                status_code = getattr(exc, "status_code", grpc.StatusCode.UNKNOWN)
                details = getattr(exc, "details", str(exc))
                self.logger.info(f"Status code: {status_code.name}, details: {details}")
                await context.abort(status_code, details)
                return

        return handler._replace(unary_unary=wrapper)  # type: ignore


def database_exception_handler(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as exc:
            if isinstance(exc, BaseAppException):  # pragma: no cover
                raise exc
            raise DatabaseException(exc)

    return wrapper


def utc_now_naive() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def utc_today() -> date:
    return datetime.now(timezone.utc).date()


def date_to_datetime(date: date) -> datetime:
    return datetime.combine(date, time())


@lru_cache
def get_month_range(year: int, month: int) -> tuple[date, date]:
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)
    return start_date, end_date


def get_ml_model_params(n_samples: int) -> tuple[int, int]:
    if n_samples < 50:
        return 30, 3
    elif n_samples < 100:
        return 50, 5
    elif n_samples < 200:
        return 100, 7
    else:
        return 150, 10
