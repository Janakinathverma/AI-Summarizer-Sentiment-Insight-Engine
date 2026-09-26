from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Summarizer & Sentiment Insight Engine"
    API_V1_STR: str = "/api/v1"
    HUGGINGFACE_API_KEY: str = ""
    BART_MODEL: str = "facebook/bart-large-cnn"
    DISTILBERT_MODEL: str = "distilbert-base-uncased-finetuned-sst-2-english"

    class Config:
        env_file = ".env"

settings = Settings()