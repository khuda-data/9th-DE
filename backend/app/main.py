from fastapi import FastAPI
app = FastAPI() # 인스턴스 생성

@app.get("/health")
async def health():
    return {"status": "ok"}