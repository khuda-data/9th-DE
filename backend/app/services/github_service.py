from urllib.parse import urlencode
from app.config import settings
import httpx




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


class GithubService:
    BASE_URL = "https://api.github.com"

    @staticmethod
    async def exchange_code_for_token(code: str) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={
                    "Accept": "application/json",
                },
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                },
            )

        response.raise_for_status()

        return response.json()["access_token"]

    @staticmethod
    async def get_user(access_token: str) -> dict:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{GithubService.BASE_URL}/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json",
                },
            )

        response.raise_for_status()

        return response.json()