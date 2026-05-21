import { useState } from "react";
import { Shirt, Plus, AlertCircle, Sparkles } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ResultsGrid from "./components/ResultsGrid";
import UploadModal from "./components/UploadModal";
import { searchByText, searchByImage, SearchResult } from "./lib/api";

export default function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const handleTextSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    try {
      const data = await searchByText(query);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async (file: File) => {
    setLoading(true);
    setError(null);
    setSearchQuery("");
    try {
      const data = await searchByImage(file);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center">
              <Shirt size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">FashionSearch</h1>
              <p className="text-zinc-500 text-xs leading-none mt-0.5">AI-powered visual fashion search</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Find your perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
              style
            </span>
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Search fashion items using text descriptions or upload an image to find visually similar styles
          </p>
        </div>

        <SearchBar
          onTextSearch={handleTextSearch}
          onImageSearch={handleImageSearch}
          loading={loading}
        />

        {error && (
          <div className="flex items-center gap-2.5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 max-w-2xl mx-auto">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <ResultsGrid
          results={results}
          loading={loading}
          searched={searched}
          query={searchQuery}
        />
      </main>

      <footer className="border-t border-zinc-900 mt-20 py-6 text-center text-zinc-600 text-sm">
        FashionSearch — Multimodal Search Engine • Built by Omkar Kolte
      </footer>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}
