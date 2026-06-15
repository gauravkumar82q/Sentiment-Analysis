import feedparser
from bs4 import BeautifulSoup


def fetch_articles(rss_url: str) -> list:
    feed = feedparser.parse(rss_url)
    if feed.bozo and not feed.entries:
        raise ValueError("Failed to parse RSS feed — check the URL.")
    articles = []
    for entry in feed.entries:
        raw = entry.get("summary", entry.get("title", ""))
        text = BeautifulSoup(raw, "html.parser").get_text().strip()
        published = entry.get("published", None)
        if text:
            articles.append({"text": text, "timestamp": published})
    return articles
