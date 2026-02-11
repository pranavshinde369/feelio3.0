import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App Config
    PROJECT_NAME: str = "Feelio AI Therapist"
    ENV_MODE: str = "dev"
    
    # API Keys
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY")
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM" # Rachel (Calm)
    
    # RAG Config
    CHROMA_PATH: str = "./data/chromadb"
    
    # Safety Keywords (Hardcoded for zero-latency lookup)
    CRISIS_KEYWORDS: list[str] = [
        "suicide", "kill myself", "end my life", "want to die", 
        "hurt myself", "take my own life", "better off dead"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()