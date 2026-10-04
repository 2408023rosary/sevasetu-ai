from pydantic import BaseModel, Field


class ComplaintRequest(BaseModel):
    text: str = Field(..., min_length=1)
    existing_complaints: list[str] = Field(default_factory=list)


class AnalysisResponse(BaseModel):
    category: str
    category_confidence: float
    priority: str
    priority_score: float
    priority_reasons: list[str]
    image_analysis: dict | None = None
    duplicate_analysis: dict | None = None  