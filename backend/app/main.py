from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil

from .config import settings
from .schemas import ChatRequest, ChatResponse, UploadResponse, Source
from .ingest import ingest_file
from .chat import answer_question

app = FastAPI(title="RAG Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@app.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type: {suffix}")

    dest = settings.upload_dir / file.filename
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        count = ingest_file(dest)
    except Exception as e:
        raise HTTPException(500, f"Ingestion failed: {e}")

    return UploadResponse(filename=file.filename, chunks_indexed=count)


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        answer, chunks = answer_question(req.question, req.history)
    except Exception as e:
        raise HTTPException(500, f"Chat failed: {e}")

    sources = [
        Source(
            filename=c["filename"],
            chunk_index=c["chunk_index"],
            snippet=c["text"][:200] + ("..." if len(c["text"]) > 200 else ""),
        )
        for c in chunks
    ]
    return ChatResponse(answer=answer, sources=sources)


@app.get("/health")
async def health():
    return {"status": "ok"}
