from fastapi import FastAPI

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