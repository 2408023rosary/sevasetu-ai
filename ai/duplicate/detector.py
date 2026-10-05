import re
from collections import Counter


def tokenize(text: str) -> list[str]:
    """
    Convert text into normalized words.
    """

    text = text.lower()

    words = re.findall(r"\b[a-z0-9]+\b", text)

    return words


def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate simple word-overlap similarity between two complaints.
    """

    words1 = Counter(tokenize(text1))
    words2 = Counter(tokenize(text2))

    if not words1 or not words2:
        return 0.0

    common_words = set(words1) & set(words2)

    total_words = set(words1) | set(words2)

    similarity = len(common_words) / len(total_words)

    return round(similarity, 2)


def detect_duplicate(
    new_complaint: str,
    existing_complaints: list[str],
    threshold: float = 0.5,
) -> dict:
    """
    Compare a new complaint against existing complaints.

    Returns the most similar complaint and similarity score.
    """

    best_match = None
    best_similarity = 0.0

    for complaint in existing_complaints:

        similarity = calculate_similarity(
            new_complaint,
            complaint
        )

        if similarity > best_similarity:
            best_similarity = similarity
            best_match = complaint

    is_duplicate = best_similarity >= threshold

    return {
        "is_duplicate": is_duplicate,
        "similarity": best_similarity,
        "matched_complaint": best_match,
    }