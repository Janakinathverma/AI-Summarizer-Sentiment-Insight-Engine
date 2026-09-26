import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger("uvicorn.error")

class HuggingFaceAPIException(Exception):
    """Custom exception for upstream Hugging Face API errors."""
    def __init__(self, message: str, status_code: int = 502):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

async def huggingface_exception_handler(request: Request, exc: HuggingFaceAPIException):
    logger.error(f"HuggingFaceAPIException on {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "Upstream AI Service Error",
            "message": exc.message,
            "path": request.url.path
        }
    )

async def generic_http_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request.",
            "details": str(exc)
        }
    )