from fastapi import FastAPI, File, Form, UploadFile
import json

from api.schemas import ComplaintRequest, AnalysisResponse
from duplicate.detector import detect_duplicate
from image.analyzer import analyze_image
from priority.predictor import predict_priority
from text.classifier import classify_complaint


app = FastAPI(
    title="SevaSetu AI",
    description="AI services for SevaSetu",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "SevaSetu AI service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_complaint(
    text: str = Form(...),
    existing_complaints: str = Form("[]"),
    image: UploadFile | None = File(None),
):
    classification = classify_complaint(text)

    priority = predict_priority(
        text,
        classification["category"]
    )

    image_result = None

    if image is not None:
        image_bytes = await image.read()
        image_result = analyze_image(image_bytes)

    try:
        complaints = json.loads(existing_complaints)

        if not isinstance(complaints, list):
            complaints = []

    except json.JSONDecodeError:
        complaints = []

    duplicate_result = detect_duplicate(
        text,
        complaints
    )

    return {
        "category": classification["category"],
        "category_confidence": classification["confidence"],
        "priority": priority["priority"],
        "priority_score": priority["score"],
        "priority_reasons": priority["reasons"],
        "image_analysis": image_result,
        "duplicate_analysis": duplicate_result,
    }


@app.post("/analyze-json", response_model=AnalysisResponse)
async def analyze_complaint_json(request: ComplaintRequest):
    classification = classify_complaint(request.text)

    priority = predict_priority(
        request.text,
        classification["category"]
    )

    duplicate_result = detect_duplicate(
        request.text,
        request.existing_complaints
    )

    return {
        "category": classification["category"],
        "category_confidence": classification["confidence"],
        "priority": priority["priority"],
        "priority_score": priority["score"],
        "priority_reasons": priority["reasons"],
        "image_analysis": None,
        "duplicate_analysis": duplicate_result,
    }