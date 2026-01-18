import uuid

def format_path(path: str) -> str:
    """Ensures a path starts with exactly one leading slash."""
    if not path:
        return "/"
    return f"/{path.strip('/')}"

def generate_unique_id(length: int = 8) -> str:
    """Generates a shortened unique identifier."""
    return str(uuid.uuid4())[:length]
    