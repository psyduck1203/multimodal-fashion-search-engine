const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface SearchResult {
  id: string;
  image_url: string;
  category: string;
  description: string;
  similarity: number;
}

export async function searchByText(query: string, topK = 12): Promise<SearchResult[]> {
  const form = new FormData();
  form.append("query", query);
  form.append("top_k", String(topK));

  const res = await fetch(`${API_BASE}/search/text`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Text search failed");
  }

  return res.json();
}

export async function searchByImage(file: File, topK = 12): Promise<SearchResult[]> {
  const form = new FormData();
  form.append("file", file);
  form.append("top_k", String(topK));

  const res = await fetch(`${API_BASE}/search/image`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Image search failed");
  }

  return res.json();
}

export async function uploadItem(
  file: File,
  category: string,
  description: string
): Promise<{ id: string; message: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("category", category);
  form.append("description", description);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}
