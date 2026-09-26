from pydantic import BaseModel, Field

class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw text to be summarized")
    max_length: int = Field(default=150, ge=30, le=500)
    min_length: int = Field(default=30, ge=10, le=100)

class SummarizeResponse(BaseModel):
    summary_text: str
    processing_time_ms: float
