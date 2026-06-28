from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:

    @staticmethod
    async def get_by_github_id(
        db: AsyncSession,
        github_id: int,
    ) -> User | None:
        result = await db.execute(
            select(User).where(User.github_id == github_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        user_id: int,
    ) -> User | None:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession,
        **kwargs,
    ) -> User:
        user = User(**kwargs)

        db.add(user)

        return user

    @staticmethod
    async def update(
        user: User,
        **kwargs,
    ) -> User:
        for key, value in kwargs.items():
            setattr(user, key, value)

        return user

    @staticmethod
    async def delete(
        db: AsyncSession,
        user: User,
    ) -> None:
        await db.delete(user)