from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import analyze, reddit, news

app = FastAPI(title="Sentiment Analysis Dashboard", version="1.0.0")

frontend_origins = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(reddit.router, prefix="/analyze", tags=["reddit"])
app.include_router(news.router, prefix="/analyze", tags=["news"])


@app.get("/health")
def health():
    return {"status": "ok"}
