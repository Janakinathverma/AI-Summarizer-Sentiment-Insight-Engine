import httpx
from app.config import settings
from app.core.exceptions import HuggingFaceAPIException

MOCK_MODE = False

class HuggingFaceService:
    def __init__(self):
        # Hugging Face Router base URL
        self.base_url = "https://router.huggingface.co/hf-inference/models"

    @property
    def headers(self):
        return {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}

    async def summarize_text(self, text: str, max_length: int, min_length: int) -> str:
        if MOCK_MODE:
            return f"[MOCK SUMMARY]: {text[:120]}... (Generated in fallback mock mode)."

        async with httpx.AsyncClient(verify=True, http2=False) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/{settings.BART_MODEL}",
                    headers=self.headers,
                    json={
                        "inputs": text,
                        "parameters": {"max_length": max_length, "min_length": min_length}
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                result = response.json()

                if isinstance(result, list) and len(result) > 0 and "summary_text" in result[0]:
                    return result[0]["summary_text"]
                elif isinstance(result, dict) and "summary_text" in result:
                    return result["summary_text"]

                raise HuggingFaceAPIException(
                    message=f"Unexpected response format from Hugging Face: {result}",
                    status_code=502
                )

            except httpx.HTTPStatusError as exc:
                err_body = exc.response.text or f"HTTP {exc.response.status_code} Error"
                raise HuggingFaceAPIException(
                    message=f"Hugging Face API Error ({exc.response.status_code}): {err_body}",
                    status_code=exc.response.status_code
                )
            except httpx.RequestError as exc:
                raise HuggingFaceAPIException(
                    message=f"Network Error: Unable to reach Hugging Face API ({str(exc)})",
                    status_code=503
                )
            except Exception as exc:
                raise HuggingFaceAPIException(
                    message=f"Internal Processing Error: {str(exc)}",
                    status_code=500
                )

    async def analyze_sentiment(self, text: str) -> dict:
        if MOCK_MODE:
            return {"label": "POSITIVE", "score": 0.9850}

        async with httpx.AsyncClient(verify=True, http2=False) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/{settings.DISTILBERT_MODEL}",
                    headers=self.headers,
                    json={"inputs": text},
                    timeout=30.0
                )
                response.raise_for_status()
                result = response.json()

                if isinstance(result, list) and len(result) > 0:
                    predictions = result[0] if isinstance(result[0], list) else result
                    if len(predictions) > 0 and "label" in predictions[0] and "score" in predictions[0]:
                        top_pred = predictions[0]
                        return {"label": top_pred["label"], "score": round(top_pred["score"], 4)}

                raise HuggingFaceAPIException(
                    message=f"Unexpected response format from Hugging Face: {result}",
                    status_code=502
                )

            except httpx.HTTPStatusError as exc:
                err_body = exc.response.text or f"HTTP {exc.response.status_code} Error"
                raise HuggingFaceAPIException(
                    message=f"Hugging Face API Error ({exc.response.status_code}): {err_body}",
                    status_code=exc.response.status_code
                )
            except httpx.RequestError as exc:
                raise HuggingFaceAPIException(
                    message=f"Network Error: Unable to reach Hugging Face API ({str(exc)})",
                    status_code=503
                )
            except Exception as exc:
                raise HuggingFaceAPIException(
                    message=f"Internal Processing Error: {str(exc)}",
                    status_code=500
                )

hf_service = HuggingFaceService()