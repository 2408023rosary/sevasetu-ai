from text.classifier import classify_complaint


def test_road_damage():
    result = classify_complaint(
        "There is a huge pothole near our college."
    )

    assert result["category"] == "Road Damage"
    assert result["confidence"] > 0


def test_garbage():
    result = classify_complaint(
        "Garbage has been dumped near the road."
    )

    assert result["category"] == "Garbage"
    assert result["confidence"] > 0


def test_water_supply():
    result = classify_complaint(
        "There has been no water supply since yesterday."
    )

    assert result["category"] == "Water Supply"
    assert result["confidence"] > 0


def test_unknown_complaint():
    result = classify_complaint(
        "There is a problem with the public park."
    )

    assert result["category"] == "Other"