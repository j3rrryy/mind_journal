import dramatiq


@dramatiq.actor
def analyze_week(user_id: str) -> None: ...


@dramatiq.actor
def analyze_month(user_id: str) -> None: ...


@dramatiq.actor
def analyze_quarter(user_id: str) -> None: ...


@dramatiq.actor
def analyze_half_year(user_id: str) -> None: ...


@dramatiq.actor
def analyze_year(user_id: str) -> None: ...
