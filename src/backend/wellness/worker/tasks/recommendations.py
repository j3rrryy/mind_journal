import dramatiq


@dramatiq.actor
def generate_recommendations(user_id: str) -> None: ...
