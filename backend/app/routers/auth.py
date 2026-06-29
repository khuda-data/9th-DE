from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.services.auth_service import AuthService
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


@router.get("/callback")
async def github_callback(
    code: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    if code is None:
        raise HTTPException(
            status_code=400,
            detail="GitHub authorization failed.",
        )

    jwt = await AuthService.github_login(
        db=db,
        code=code,
    )

    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?token={jwt}"
    )