from grpc import StatusCode


class BaseAppException(Exception):
    status_code: StatusCode
    details: str


class DatabaseException(BaseAppException):
    status_code = StatusCode.INTERNAL

    def __init__(self, exc: Exception):
        self.details = f"Internal database error: {exc}"
