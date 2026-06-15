from pydantic import BaseModel
from typing import Optional, List


class TextRequest(BaseModel):
    text: str


class RedditRequest(BaseModel):
    subreddit: str = ""
    query: str = ""
    limit: int = 25


class NewsRequest(BaseModel):
    rss_url: str


class SentimentResult(BaseModel):
    text: str
    sentiment: str
    score: float
    timestamp: Optional[str] = None


class SentimentResponse(BaseModel):
    results: List[SentimentResult]
    summary: dict
