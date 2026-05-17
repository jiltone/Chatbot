from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Groq
    groq_api_key: str = ""
    llm_model: str = "llama-3.1-8b-instant"

    # Paths
    base_dir: Path = Path(__file__).resolve().parent.parent
    upload_dir: Path = base_dir / "data" / "uploads"
    chroma_dir: Path = base_dir / "data" / "chroma"

    # Chunking
    chunk_size: int = 800
    chunk_overlap: int = 120

    # Retrieval
    top_k: int = 4

    model_config = {"env_file": str(Path(__file__).resolve().parent.parent / ".env")}


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.chroma_dir.mkdir(parents=True, exist_ok=True)
