from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import TextRequest, SentimentResult, SentimentResponse
from services.sentiment import analyze_texts
import pandas as pd
import io
from datetime import datetime, timezone

router = APIRouter()


def build_response(items: list) -> SentimentResponse:
    results = []
    labels = {"positive": 0, "neutral": 0, "negative": 0}
    by_date: dict = {}

    for item in items:
        sentiment = item["sentiment"]
        labels[sentiment] = labels.get(sentiment, 0) + 1
        timestamp = item.get("timestamp")

        results.append(
            SentimentResult(
                text=item["text"],
                sentiment=sentiment,
                score=item["score"],
                timestamp=timestamp,
            )
        )

        if timestamp:
            date = str(timestamp)[:10]
            if date not in by_date:
                by_date[date] = {"positive": 0, "neutral": 0, "negative": 0}
            by_date[date][sentiment] += 1

    summary = {
        **labels,
        "by_date": [{"date": d, **v} for d, v in sorted(by_date.items())],
    }
    return SentimentResponse(results=results, summary=summary)


@router.post("/text")
async def analyze_text(req: TextRequest) -> SentimentResponse:
    sentiments = analyze_texts([req.text])
    items = [
        {
            "text": req.text,
            "sentiment": sentiments[0]["sentiment"],
            "score": sentiments[0]["score"],
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        }
    ]
    return build_response(items)


@router.post("/upload")
async def analyze_upload(
    file: UploadFile = File(...),
    column: str = Form("text"),
) -> SentimentResponse:
    content = await file.read()
    try:
        if file.filename and file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {e}")

    if column not in df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Column '{column}' not found. Available columns: {list(df.columns)}",
        )

    texts = df[column].dropna().astype(str).tolist()
    timestamp_col = next(
        (c for c in ["timestamp", "date", "created_at"] if c in df.columns), None
    )

    sentiments = analyze_texts(texts)
    items = []
    for i, (text, sent) in enumerate(zip(texts, sentiments)):
        ts = str(df.iloc[i][timestamp_col]) if timestamp_col else None
        items.append(
            {
                "text": text,
                "sentiment": sent["sentiment"],
                "score": sent["score"],
                "timestamp": ts,
            }
        )

    return build_response(items)
