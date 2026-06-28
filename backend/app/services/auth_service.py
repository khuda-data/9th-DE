from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token
from app.repositories.user_repository import UserRepository
from app.services.github_service import GithubService


class AuthService:

    @staticmethod
    async def github_login(
        db: AsyncSession,
        code: str,
    ) -> str:

        # 1. code → access_token
        github_access_token = await GithubService.exchange_code_for_token(code)

        # 2. GitHub User 조회
        github_user = await GithubService.get_user(github_access_token)

        # 3. DB 조회
        user = await UserRepository.get_by_github_id(
            db,
            github_user["id"],
        )

        if user is None:
            user = await UserRepository.create(
                db=db,
                github_id=github_user["id"],
                login=github_user["login"],
                name=github_user.get("name"),
                avatar_url=github_user["avatar_url"],
                access_token=github_access_token,
            )

        else:
            UserRepository.update(
                user,
                login=github_user["login"],
                name=github_user.get("name"),
                avatar_url=github_user["avatar_url"],
                access_token=github_access_token,
            )

        await db.commit()
        await db.refresh(user)

        jwt = create_access_token(user.id)

        return jwt