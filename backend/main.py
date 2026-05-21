import os
import json
import uuid
import shutil
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional

import numpy as np
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

from embeddings import CLIPEmbedder
from search import FaissSearchIndex
from database import MetadataDB

load_dotenv()

CLIP_MODEL_NAME = os.getenv("CLIP_MODEL_NAME", "hf-internal-testing/tiny-random-clip")
FAISS_INDEX_PATH = os.getenv("FAISS_INDEX_PATH", "./faiss_index.bin")
METADATA_DB_PATH = os.getenv("METADATA_DB_PATH", "../data/metadata.json")
DATA_DIR = Path(os.getenv("DATA_DIR", "../data/images"))
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "../data/uploads"))

embedder: CLIPEmbedder = None
search_index: FaissSearchIndex = None
metadata_db: MetadataDB = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global embedder, search_index, metadata_db

    print("Loading CLIP model...")
    embedder = CLIPEmbedder(CLIP_MODEL_NAME)

    print("Loading metadata DB...")
    metadata_db = MetadataDB(METADATA_DB_PATH)

    print("Loading/building FAISS index...")
    search_index = FaissSearchIndex(dimension=512)

    if Path(FAISS_INDEX_PATH).exists() and len(metadata_db.get_all()) > 0:
        search_index.load(FAISS_INDEX_PATH)
        print(f"Loaded FAISS index with {search_index.size()} vectors")
    else:
        await build_index_from_data()

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    yield
    print("Shutting down...")


async def build_index_from_data():
    items = metadata_db.get_all()
    if not items:
        print("No items found. Seeding sample data...")
        from seed import seed_data
        seed_data(metadata_db)
        items = metadata_db.get_all()

    print(f"Building index for {len(items)} items...")
    for item in items:
        image_path = Path(item["image_path"])
        if image_path.exists():
            try:
                embedding = embedder.embed_image_path(str(image_path))
                search_index.add(embedding, item["id"])
            except Exception as e:
                print(f"Error embedding {image_path}: {e}")

    if search_index.size() > 0:
        search_index.save(FAISS_INDEX_PATH)
        print(f"Index built with {search_index.size()} vectors")


app = FastAPI(title="Fashion Search API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_images_path = DATA_DIR
upload_path = UPLOAD_DIR
data_images_path.mkdir(parents=True, exist_ok=True)
upload_path.mkdir(parents=True, exist_ok=True)

app.mount("/images", StaticFiles(directory=str(DATA_DIR)), name="images")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


class SearchResult(BaseModel):
    id: str
    image_url: str
    category: str
    description: str
    similarity: float


def format_result(item_id: str, score: float) -> Optional[dict]:
    item = metadata_db.get(item_id)
    if not item:
        return None

    image_path = Path(item["image_path"])
    if str(DATA_DIR) in str(image_path):
        rel = image_path.relative_to(DATA_DIR)
        image_url = f"/images/{rel}"
    elif str(UPLOAD_DIR) in str(image_path):
        rel = image_path.relative_to(UPLOAD_DIR)
        image_url = f"/uploads/{rel}"
    else:
        image_url = f"/images/{image_path.name}"

    return {
        "id": item_id,
        "image_url": image_url,
        "category": item.get("category", "unknown"),
        "description": item.get("description", ""),
        "similarity": round(float(score), 4),
    }


@app.get("/health")
def health():
    return {"status": "ok", "index_size": search_index.size() if search_index else 0}


@app.post("/search/text", response_model=list[SearchResult])
async def search_by_text(query: str = Form(...), top_k: int = Form(12)):
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        embedding = embedder.embed_text(query)
        results = search_index.search(embedding, top_k=min(top_k, search_index.size()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    output = []
    for item_id, score in results:
        r = format_result(item_id, score)
        if r:
            output.append(r)
    return output


@app.post("/search/image", response_model=list[SearchResult])
async def search_by_image(file: UploadFile = File(...), top_k: int = Form(12)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    try:
        embedding = embedder.embed_image_bytes(contents)
        results = search_index.search(embedding, top_k=min(top_k, search_index.size()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    output = []
    for item_id, score in results:
        r = format_result(item_id, score)
        if r:
            output.append(r)
    return output


@app.post("/upload")
async def upload_item(
    file: UploadFile = File(...),
    category: str = Form(...),
    description: str = Form(...),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    item_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix or ".jpg"
    filename = f"{item_id}{ext}"
    save_path = UPLOAD_DIR / filename

    contents = await file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    try:
        embedding = embedder.embed_image_bytes(contents)
    except Exception as e:
        save_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")

    metadata_db.add({
        "id": item_id,
        "image_path": str(save_path),
        "category": category,
        "description": description,
    })

    search_index.add(embedding, item_id)
    search_index.save(FAISS_INDEX_PATH)

    return {"id": item_id, "message": "Item uploaded successfully"}


@app.get("/items")
def list_items():
    return metadata_db.get_all()
