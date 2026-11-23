import platform
from datetime import UTC, datetime


def main(message: str = "pong") -> dict:
    return {
        "status": "ok",
        "message": message,
        "workspace": "factory",
        "python": platform.python_version(),
        "timestamp": datetime.now(UTC).isoformat(),
    }
