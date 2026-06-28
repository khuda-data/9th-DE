from fastapi import FastAPI
from app.routers import auth


app = FastAPI() # 인스턴스 생성

@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(auth.router)