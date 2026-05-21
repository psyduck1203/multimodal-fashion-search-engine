import faiss
import numpy as np
from typing import List, Tuple


class FaissSearchIndex:
    def __init__(self, dimension: int = 512):
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension)  # inner product = cosine sim on normalized vecs
        self.id_map: List[str] = []

    def add(self, embedding: np.ndarray, item_id: str):
        vec = embedding.reshape(1, -1).astype(np.float32)
        self.index.add(vec)
        self.id_map.append(item_id)

    def search(self, embedding: np.ndarray, top_k: int = 12) -> List[Tuple[str, float]]:
        if self.index.ntotal == 0:
            return []
        vec = embedding.reshape(1, -1).astype(np.float32)
        k = min(top_k, self.index.ntotal)
        distances, indices = self.index.search(vec, k)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.id_map):
                results.append((self.id_map[idx], float(dist)))
        return results

    def size(self) -> int:
        return self.index.ntotal

    def save(self, path: str):
        import json
        faiss.write_index(self.index, path)
        with open(path + ".ids", "w") as f:
            json.dump(self.id_map, f)

    def load(self, path: str):
        import json
        self.index = faiss.read_index(path)
        with open(path + ".ids", "r") as f:
            self.id_map = json.load(f)
