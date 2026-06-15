import os
import praw
from dotenv import load_dotenv

load_dotenv()


def get_reddit_client():
    return praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent="sentiment-dashboard/1.0 (by u/anonymous)",
    )


def fetch_posts(subreddit: str, query: str, limit: int) -> list:
    reddit = get_reddit_client()
    posts = []
    try:
        if query:
            sub = subreddit if subreddit else "all"
            results = reddit.subreddit(sub).search(query, limit=limit)
        else:
            results = reddit.subreddit(subreddit).hot(limit=limit)
        for post in results:
            text = post.title
            if post.selftext:
                text += " " + post.selftext
            posts.append({"text": text, "timestamp": str(post.created_utc)})
    except Exception as e:
        raise ValueError(f"Reddit fetch failed: {e}")
    return posts
