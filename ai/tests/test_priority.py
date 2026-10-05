from priority.predictor import predict_priority


def test_high_priority_flood():
    result = predict_priority(
        "There is water flooding the street near the hospital.",
        "Water Supply"
    )

    assert result["priority"] == "HIGH"
    assert result["score"] >= 0.75


def test_medium_priority_pothole():
    result = predict_priority(
        "There is a huge pothole near our college.",
        "Road Damage"
    )

    assert result["priority"] == "MEDIUM"
    assert result["score"] >= 0.50


def test_low_priority_streetlight():
    result = predict_priority(
        "The streetlight is not working.",
        "Streetlight"
    )

    assert result["priority"] == "LOW"