import { useState, useRef } from "react";
import { Search, Upload, X } from "lucide-react";

interface Props {
  onTextSearch: (query: string) => void;
  onImageSearch: (file: File) => void;
  loading: boolean;
}

export default function SearchBar({ onTextSearch, onImageSearch, loading }: Props) {
  const [query, setQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onTextSearch(query.trim());
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setQuery("");
    onImageSearch(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleTextSubmit} className="relative group">
        <div className="relative flex items-center">
          <Search
            className="absolute left-4 text-zinc-400 group-focus-within:text-sky-400 transition-colors"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by description… e.g. 'Casual blue shirts for men'"
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-sky-500 text-white placeholder-zinc-500 rounded-2xl pl-12 pr-36 py-4 text-base outline-none transition-all focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-xl transition-all text-sm"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-500 text-sm">or search by image</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {previewUrl ? (
        <div className="relative w-fit mx-auto">
          <img
            src={previewUrl}
            alt="Search image"
            className="h-32 rounded-xl border border-zinc-700 object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-zinc-800 border border-zinc-700 hover:bg-red-500 text-zinc-300 hover:text-white rounded-full p-1 transition-colors"
          >
            <X size={14} />
          </button>
          {loading && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-sky-500 bg-sky-500/10"
              : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/60"
          }`}
        >
          <Upload className="mx-auto mb-3 text-zinc-500" size={28} />
          <p className="text-zinc-400 text-sm">
            Drag & drop an image, or <span className="text-sky-400 font-medium">browse</span>
          </p>
          <p className="text-zinc-600 text-xs mt-1">JPG, PNG, WEBP supported</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
