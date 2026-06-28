from fastapi import APIRouter
from fastapi.responses import RedirectResponse

from app.services.github_service import get_github_login_url

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.get("/github")
async def github_login():
    return RedirectResponse(
        url=get_github_login_url()
    )