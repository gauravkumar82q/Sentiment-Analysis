from fastapi import APIRouter, HTTPException
from models.schemas import NewsRequest, SentimentResponse
from services.news_service import fetch_articles
from services.sentiment import analyze_texts
from routers.analyze import build_response

router = APIRouter()


@router.post("/news")
async def analyze_news(req: NewsRequest) -> SentimentResponse:
    try:
        articles = fetch_articles(req.rss_url)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if not articles:
        raise HTTPException(status_code=404, detail="No articles found in the feed.")

    texts = [a["text"] for a in articles]
    sentiments = analyze_texts(texts)

    items = []
    for article, sent in zip(articles, sentiments):
        items.append(
            {
                "text": article["text"],
                "sentiment": sent["sentiment"],
                "score": sent["score"],
                "timestamp": article.get("timestamp"),
            }
        )

    return build_response(items)
