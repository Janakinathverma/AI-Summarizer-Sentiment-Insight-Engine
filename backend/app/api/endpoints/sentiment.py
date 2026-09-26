from fastapi import APIRouter, HTTPException
from app.schemas.sentiment import SentimentRequest, SentimentResponse
from app.services.huggingface import hf_service

router = APIRouter()

@router.post("/sentiment", response_model=SentimentResponse, tags=["AI Features"])
async def sentiment(payload: SentimentRequest):
    try:
        result = await hf_service.analyze_sentiment(payload.text)
        return SentimentResponse(label=result["label"], score=result["score"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
