from duplicate.detector import (
    calculate_similarity,
    detect_duplicate,
)


def test_similar_complaints():
    complaint1 = "There is a large pothole near the college gate."

    complaint2 = "A large pothole is present near the college gate."

    similarity = calculate_similarity(
        complaint1,
        complaint2
    )

    assert similarity >= 0.5


def test_different_complaints():
    complaint1 = "There is a pothole near the college."

    complaint2 = "Garbage has been dumped near the market."

    similarity = calculate_similarity(
        complaint1,
        complaint2
    )

    assert similarity < 0.5


def test_duplicate_detection():
    new_complaint = "There is a large pothole near the college gate."

    existing_complaints = [
        "A large pothole is present near the college gate.",
        "Garbage has been dumped near the market.",
    ]

    result = detect_duplicate(
        new_complaint,
        existing_complaints
    )

    assert result["is_duplicate"] is True
    assert result["matched_complaint"] is not None


def test_no_duplicate():
    new_complaint = "The streetlight is broken near the bus stop."

    existing_complaints = [
        "Garbage has been dumped near the market.",
        "There is a water leakage near the hospital.",
    ]

    result = detect_duplicate(
        new_complaint,
        existing_complaints
    )

    assert result["is_duplicate"] is False