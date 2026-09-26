import time
from fastapi import APIRouter, HTTPException
from app.schemas.summarize import SummarizeRequest, SummarizeResponse
from app.services.huggingface import hf_service
from app.core.exceptions import HuggingFaceAPIException

router = APIRouter()

@router.post("/summarize", response_model=SummarizeResponse, tags=["AI Features"])
async def summarize(payload: SummarizeRequest):
    start_time = time.time()
    try:
        summary = await hf_service.summarize_text(
            text=payload.text,
            max_length=payload.max_length,
            min_length=payload.min_length
        )
        elapsed_ms = (time.time() - start_time) * 1000
        return SummarizeResponse(summary_text=summary, processing_time_ms=round(elapsed_ms, 2))
    except HuggingFaceAPIException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")