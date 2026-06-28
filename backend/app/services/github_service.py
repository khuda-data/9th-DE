from urllib.parse import urlencode

from app.config import settings


def get_github_login_url() -> str:
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": f"{settings.BACKEND_URL}/auth/callback",
        "scope": "repo",
    }

    return (
        "https://github.com/login/oauth/authorize?"
        + urlencode(params)
    )