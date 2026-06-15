from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_pipeline = None
_vader = None


def get_pipeline():
    global _pipeline
    if _pipeline is None:
        try:
            _pipeline = pipeline(
                "text-classification",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                top_k=1,
                truncation=True,
                max_length=512,
                local_files_only=True,
            )
        except Exception:
            _pipeline = False
    return _pipeline


def get_vader():
    global _vader
    if _vader is None:
        _vader = SentimentIntensityAnalyzer()
    return _vader


def analyze_texts(texts: list) -> list:
    pipe = get_pipeline()
    vader = get_vader()
    results = []
    for text in texts:
        try:
            if pipe:
                out = pipe(text[:512])[0][0]
                raw_label = out["label"].lower()
                score = round(out["score"], 4)
                if score < 0.65:
                    label = "neutral"
                elif raw_label == "positive":
                    label = "positive"
                else:
                    label = "negative"
            else:
                compound = vader.polarity_scores(text)["compound"]
                score = round(abs(compound), 4)
                if compound >= 0.05:
                    label = "positive"
                elif compound <= -0.05:
                    label = "negative"
                else:
                    label = "neutral"
            results.append({"sentiment": label, "score": score})
        except Exception:
            results.append({"sentiment": "neutral", "score": 0.0})
    return results
