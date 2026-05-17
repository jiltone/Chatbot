from .ingest import collection
from .config import settings


def retrieve(query: str, k: int = None) -> list[dict]:
    """Return the top-k most relevant chunks for a query."""
    k = k or settings.top_k
    results = collection.query(
        query_texts=[query],
        n_results=k,
    )
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    return [
        {
            "text": doc,
            "filename": meta["filename"],
            "chunk_index": meta["chunk_index"],
        }
        for doc, meta in zip(docs, metas)
    ]
