def user_record_list_key(user_id: str, year: int, month: int) -> str:
    return f"user:{user_id}:record_list:{year}:{month}"


def user_dashboard_key(user_id: str) -> str:
    return f"user:{user_id}:dashboard"


def user_all_keys(user_id: str) -> str:
    return f"user:{user_id}:*"
