from io import BytesIO

from PIL import Image

from image.analyzer import analyze_image


def create_test_image() -> bytes:
    image = Image.new("RGB", (100, 100), "white")

    buffer = BytesIO()
    image.save(buffer, format="PNG")

    return buffer.getvalue()


def test_valid_image():
    image_bytes = create_test_image()

    result = analyze_image(image_bytes)

    assert result["valid"] is True
    assert result["format"] == "PNG"
    assert result["width"] == 100
    assert result["height"] == 100


def test_invalid_image():
    result = analyze_image(b"this is not an image")

    assert result["valid"] is False