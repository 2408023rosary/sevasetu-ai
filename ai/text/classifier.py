from text.preprocessing import clean_text


CATEGORY_KEYWORDS = {
    "Road Damage": [
        "pothole",
        "road damage",
        "broken road",
        "damaged road",
        "crack in road",
        "road crack",
    ],
    "Garbage": [
        "garbage",
        "trash",
        "waste",
        "litter",
        "dump",
        "dirty",
    ],
    "Water Supply": [
        "water shortage",
        "no water",
        "water supply",
        "water leakage",
        "water leak",
        "pipeline",
    ],
    "Streetlight": [
        "streetlight",
        "street light",
        "lamp post",
        "light not working",
        "broken light",
    ],
    "Drainage": [
        "drain",
        "drainage",
        "sewage",
        "sewer",
        "overflowing drain",
    ],
    "Electricity": [
        "power cut",
        "power outage",
        "electricity",
        "electric pole",
        "transformer",
    ],
}


def classify_complaint(text: str) -> dict:
    """
    Classify a civic complaint based on keyword matching.

    Returns category and confidence score.
    """

    cleaned_text = clean_text(text)

    scores = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(
            1
            for keyword in keywords
            if keyword in cleaned_text
        )

        scores[category] = score

    best_category = max(scores, key=scores.get)
    best_score = scores[best_category]

    if best_score == 0:
        return {
            "category": "Other",
            "confidence": 0.30,
        }

    confidence = min(
        0.60 + (best_score * 0.10),
        0.95,
    )

    return {
        "category": best_category,
        "confidence": round(confidence, 2),
    }