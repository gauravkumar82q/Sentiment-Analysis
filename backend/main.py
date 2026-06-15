from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, reddit, news

app = FastAPI(title="Sentiment Analysis Dashboard", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
