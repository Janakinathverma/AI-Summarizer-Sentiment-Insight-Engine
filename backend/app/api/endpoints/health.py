from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health Checks"])
async def health_check():
    return {"status": "healthy", "service": "Backend API"}
