from fastapi import APIRouter, HTTPException
from models.schemas import RedditRequest, SentimentResponse
from services.reddit_service import fetch_posts
from services.sentiment import analyze_texts
from routers.analyze import build_response
from datetime import datetime

router = APIRouter()


@router.post("/reddit")
async def analyze_reddit(req: RedditRequest) -> SentimentResponse:
    if not req.subreddit and not req.query:
        raise HTTPException(
            status_code=400, detail="Provide at least a subreddit or a search query."
        )
    try:
        posts = fetch_posts(req.subreddit, req.query, req.limit)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if not posts:
        raise HTTPException(status_code=404, detail="No posts found.")

    texts = [p["text"] for p in posts]
    sentiments = analyze_texts(texts)

    items = []
    for post, sent in zip(posts, sentiments):
        ts = post.get("timestamp", "")
        try:
            ts = datetime.utcfromtimestamp(float(ts)).strftime("%Y-%m-%d")
        except Exception:
            ts = str(ts)[:10]
        items.append(
            {
                "text": post["text"],
                "sentiment": sent["sentiment"],
                "score": sent["score"],
                "timestamp": ts,
            }
        )

    return build_response(items)
