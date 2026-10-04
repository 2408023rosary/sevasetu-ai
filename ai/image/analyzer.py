from io import BytesIO

from PIL import Image


def analyze_image(image_bytes: bytes) -> dict:
    """
    Analyze a complaint image and return basic image metadata.

    This lightweight analyzer validates the image and extracts
    properties that can later be passed to a computer-vision model.
    """

    try:
        image = Image.open(BytesIO(image_bytes))

        width, height = image.size

        return {
            "valid": True,
            "format": image.format,
            "width": width,
            "height": height,
            "mode": image.mode,
        }

    except Exception:
        return {
            "valid": False,
            "format": None,
            "width": None,
            "height": None,
            "mode": None,
        }