# FashionSearch — Multimodal AI Fashion Search Engine

A full-stack fashion search engine powered by OpenAI CLIP embeddings and FAISS vector similarity search. Search clothing items by text description or by uploading a photo.

---

## Architecture

```
frontend/   →  React + Tailwind CSS (Vite)
backend/    →  FastAPI + CLIP + FAISS
data/
  images/   →  Seeded clothing images (downloaded from Pexels)
  uploads/  →  User-uploaded items
```

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | FastAPI, Python 3.10+ |
| Embeddings | HuggingFace `openai/clip-vit-base-patch32` |
| Vector Search | FAISS (IndexFlatIP — cosine similarity) |
| Metadata Store | Local JSON file |

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip

### 1. Clone / download the project

```bash
git clone <repo-url>
cd fashion-search
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy and configure environment variables:
```bash
cp .env.example .env  # edit if needed
```

### 3. Frontend setup

From the project root:
```bash
npm install
```

Configure the API URL (already set in `.env`):
```
VITE_API_URL=http://localhost:8000
```

---

## Running Locally

### Start the backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

On first startup the backend will:
1. Load the CLIP model (~340 MB, downloaded once from HuggingFace)
2. Download 20 sample clothing images from Pexels and save them to `data/images/`
3. Generate CLIP embeddings for all images
4. Build and save the FAISS index to `faiss_index.bin`

This takes 1-3 minutes on the first run.

### Start the frontend

From the project root:
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `GET /health` | GET | Health check + index size |
| `POST /search/text` | POST | Search by text query |
| `POST /search/image` | POST | Search by uploaded image |
| `POST /upload` | POST | Upload new clothing item |
| `GET /items` | GET | List all items |

### POST /search/text
```
Form fields:
  query   string  (required) — text description
  top_k   int     (optional, default 12)

Response: [{id, image_url, category, description, similarity}, ...]
```

### POST /search/image
```
Form fields:
  file    image file  (required)
  top_k   int         (optional, default 12)

Response: [{id, image_url, category, description, similarity}, ...]
```

### POST /upload
```
Form fields:
  file         image file  (required)
  category     string      (required)
  description  string      (required)

Response: {id, message}
```

---

## Features

- **Text search** — Describe what you're looking for in natural language
- **Image search** — Upload a photo to find visually similar items
- **Similarity scores** — Each result shows a match percentage
- **Upload new items** — Expand the catalog and they're instantly searchable
- **Dark mode UI** — Clean, modern interface with loading states and error handling

---

## Screenshots

### Home / Search
> _[Screenshot placeholder: search bar with text input and drag-and-drop image upload zone]_

### Text Search Results
> _[Screenshot placeholder: grid of clothing items with similarity percentage bars]_

### Image Search
> _[Screenshot placeholder: uploaded image preview with matching results grid]_

### Upload Modal
> _[Screenshot placeholder: upload form with image preview, category selector, description field]_

---

## Demo

1. Type "blue denim jacket" into the search bar and press Search
2. The CLIP model encodes your text into a 512-d vector
3. FAISS performs cosine similarity search against all indexed image embeddings
4. Results are ranked by similarity and displayed with match scores

For image search, upload any clothing photo and the system finds the most visually similar items using CLIP's shared image-text embedding space.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `CLIP_MODEL_NAME` | `openai/clip-vit-base-patch32` | HuggingFace model ID |
| `FAISS_INDEX_PATH` | `./faiss_index.bin` | Where to save/load FAISS index |
| `METADATA_DB_PATH` | `../data/metadata.json` | JSON metadata store path |
| `DATA_DIR` | `../data/images` | Sample images directory |
| `UPLOAD_DIR` | `../data/uploads` | Uploaded images directory |

### Frontend (`.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |
