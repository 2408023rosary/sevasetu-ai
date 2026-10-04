from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "SevaSetu AI service is running"


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_analyze_json():
    response = client.post(
        "/analyze-json",
        json={
            "text": "There is a large pothole near the college gate.",
            "existing_complaints": [
                "There is a large pothole near the college gate.",
                "Garbage has been dumped near the market.",
            ],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["category"] == "Road Damage"
    assert data["priority"] == "MEDIUM"
    assert data["duplicate_analysis"]["is_duplicate"] is True
    assert data["duplicate_analysis"]["similarity"] == 1.0


def test_analyze_json_without_duplicates():
    response = client.post(
        "/analyze-json",
        json={
            "text": "The streetlight is not working near the bus stop.",
            "existing_complaints": [
                "Garbage has been dumped near the market.",
                "There is water leakage near the hospital.",
            ],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["category"] == "Streetlight"
    assert data["priority"] == "LOW"
    assert data["duplicate_analysis"]["is_duplicate"] is False


def test_analyze_with_image():
    from io import BytesIO

    from PIL import Image

    image = Image.new("RGB", (100, 100), "white")

    buffer = BytesIO()
    image.save(buffer, format="PNG")

    response = client.post(
        "/analyze",
        data={
            "text": "There is a pothole near the college.",
            "existing_complaints": "[]",
        },
        files={
            "image": (
                "test.png",
                buffer.getvalue(),
                "image/png",
            ),
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["category"] == "Road Damage"
    assert data["image_analysis"] is not None
    assert data["image_analysis"]["valid"] is True
    assert data["image_analysis"]["format"] == "PNG"
    assert data["image_analysis"]["width"] == 100
    assert data["image_analysis"]["height"] == 100