from pathlib import Path
from dotenv import load_dotenv
import os
from groq import Groq
from .config import settings
from .retriever import retrieve

_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

SYSTEM_PROMPT = """You are a helpful assistant that answers questions using only the provided context from the user's documents.

Rules:
- If the context does not contain the answer, say "I could not find that in the uploaded documents."
- Quote or paraphrase the context; do not invent facts.
- Keep answers concise and clear.
- Cite the source filename in parentheses when relevant."""


def build_prompt(question: str, chunks: list[dict]) -> str:
    context_blocks = []
    for i, c in enumerate(chunks, 1):
        context_blocks.append(f"[Source {i}: {c['filename']}]\n{c['text']}")
    context = "\n\n---\n\n".join(context_blocks)
    return f"Context from documents:\n\n{context}\n\nQuestion: {question}\n\nAnswer:"


def answer_question(question: str, history: list[dict]) -> tuple[str, list[dict]]:
    # Re-read .env on every call so key changes take effect without restarting
    load_dotenv(_ENV_FILE, override=True)
    api_key = os.getenv("GROQ_API_KEY") or settings.groq_api_key
    client = Groq(api_key=api_key)

    chunks = retrieve(question)
    user_prompt = build_prompt(question, chunks)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history[-6:])
    messages.append({"role": "user", "content": user_prompt})

    response = client.chat.completions.create(
        model=settings.llm_model,
        messages=messages,
        max_tokens=1024,
    )
    answer = response.choices[0].message.content
    return answer, chunks
