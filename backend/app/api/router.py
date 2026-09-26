from fastapi import APIRouter
from app.api.endpoints import summarize, sentiment, health

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(summarize.router)
api_router.include_router(sentiment.router)