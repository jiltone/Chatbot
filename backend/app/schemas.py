from pydantic import BaseModel
from typing import List


class ChatRequest(BaseModel):
    question: str
    history: List[dict] = []  # [{"role": "user"|"assistant", "content": "..."}]


class Source(BaseModel):
    filename: str
    chunk_index: int
    snippet: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]


class UploadResponse(BaseModel):
    filename: str
    chunks_indexed: int
