def predict_priority(text: str, category: str) -> dict:
    """
    Predict complaint priority using transparent rule-based signals.

    Returns:
        priority: LOW, MEDIUM, or HIGH
        score: heuristic priority score
        reasons: signals that influenced the prediction
    """

    text = text.lower().strip()

    high_priority_keywords = [
        "emergency",
        "danger",
        "accident",
        "flood",
        "fire",
        "sparking",
        "electric shock",
        "major leak",
        "blocked road",
        "hospital",
    ]

    medium_priority_keywords = [
        "urgent",
        "overflow",
        "broken",
        "severe",
        "large",
        "huge",
        "major",
        "dangerous",
        "not working",
        "no water",
        "power outage",
    ]

    score = 0.3
    reasons = []

    # High-priority signals
    for keyword in high_priority_keywords:
        if keyword in text:
            score += 0.3
            reasons.append(f"High-risk keyword: {keyword}")

    # Medium-priority signals
    for keyword in medium_priority_keywords:
        if keyword in text:
            score += 0.15
            reasons.append(f"Priority keyword: {keyword}")

    # Category-specific rules
    if category == "Electricity" and any(
        word in text for word in [
            "sparking",
            "electric shock",
            "danger"
        ]
    ):
        score += 0.2
        reasons.append("Electrical safety risk")

    if category == "Water Supply" and any(
        word in text for word in [
            "flood",
            "major leak",
            "overflow"
        ]
    ):
        score += 0.2
        reasons.append("Water-related hazard")

    if category == "Road Damage" and any(
        word in text for word in [
            "huge pothole",
            "large pothole",
            "dangerous pothole"
        ]
    ):
        score += 0.2
        reasons.append("Significant road hazard")

    if category == "Streetlight" and any(
        word in text for word in [
            "entire street",
            "multiple lights",
            "dark road"
        ]
    ):
        score += 0.2
        reasons.append("Area-wide lighting issue")

    # Keep score within valid range
    score = min(score, 1.0)

    # Convert score into priority level
    if score >= 0.75:
        priority = "HIGH"
    elif score >= 0.50:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    return {
        "priority": priority,
        "score": round(score, 2),
        "reasons": reasons,
    }