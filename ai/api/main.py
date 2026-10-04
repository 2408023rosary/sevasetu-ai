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


@app.post("/analyze-json", response_model=AnalysisResponse)
async def analyze_complaint_json(request: ComplaintRequest):
    # Step 1: Classify complaint
    classification = classify_complaint(request.text)

    # Step 2: Predict priority
    priority = predict_priority(
        request.text,
        classification["category"]
    )

    # Step 3: Detect duplicate complaint
    duplicate_result = detect_duplicate(
        request.text,
        request.existing_complaints
    )

    # Step 4: Return combined AI result
    return {
        "category": classification["category"],
        "category_confidence": classification["confidence"],
        "priority": priority["priority"],
        "priority_score": priority["score"],
        "priority_reasons": priority["reasons"],
        "image_analysis": None,
        "duplicate_analysis": duplicate_result,
    }