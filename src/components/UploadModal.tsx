import { useState, useRef } from "react";
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { uploadItem } from "../lib/api";

interface Props {
  onClose: () => void;
}

const CATEGORIES = [
  "t-shirt", "shirt", "jeans", "dress", "jacket", "hoodie",
  "skirt", "coat", "shorts", "sneakers", "boots", "accessory", "other",
];

export default function UploadModal({ onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("t-shirt");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await uploadItem(file, category, description.trim());
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Upload Item</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <CheckCircle className="text-emerald-400 mb-3" size={40} />
            <p className="text-white font-medium">Item uploaded successfully!</p>
            <p className="text-zinc-500 text-sm mt-1">It will now appear in search results</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative cursor-pointer border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl overflow-hidden transition-colors"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-zinc-500">
                  <Upload size={28} className="mb-2" />
                  <span className="text-sm">Click to select image</span>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <div>
              <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the clothing item…"
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky-500 resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file || !description.trim()}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </span>
              ) : "Upload Item"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
