import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.router import api_router
from app.config import settings
from app.core.exceptions import (
    HuggingFaceAPIException,
    huggingface_exception_handler,
    generic_http_exception_handler
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers Registration
app.add_exception_handler(HuggingFaceAPIException, huggingface_exception_handler)
app.add_exception_handler(Exception, generic_http_exception_handler)

# API Router Chaining
app.include_router(api_router, prefix=settings.API_V1_STR)

# Static Files & React SPA Integration
static_dir = os.path.join(os.path.dirname(__file__), "static")

if os.path.exists(static_dir):
    # React assets (JS, CSS, images) mount point
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Catch-all Route for Single Page Application (SPA)
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Exclude API, docs, and openapi routes so FastAPI router handles them
        if full_path.startswith("api") or full_path.startswith("docs") or full_path == "openapi.json":
            raise HTTPException(status_code=404, detail="API route not found")

        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)

        return {"error": "React index.html file not found in static folder"}
else:
    @app.get("/")
    async def root():
        return {"message": "Welcome to AI Summarizer & Sentiment Insight Engine API"}