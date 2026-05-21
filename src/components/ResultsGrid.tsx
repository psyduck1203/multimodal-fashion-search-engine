import { SearchResult } from "../lib/api";
import ResultCard from "./ResultCard";
import { Layers } from "lucide-react";

interface Props {
  results: SearchResult[];
  loading: boolean;
  searched: boolean;
  query: string;
}

function Skeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="aspect-[3/4] bg-zinc-800 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-zinc-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
        <div className="h-1 bg-zinc-800 rounded animate-pulse mt-3" />
      </div>
    </div>
  );
}

export default function ResultsGrid({ results, loading, searched, query }: Props) {
  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Finding similar items…</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <Layers className="text-zinc-600" size={28} />
        </div>
        <h3 className="text-zinc-400 font-medium mb-1">Search the catalog</h3>
        <p className="text-zinc-600 text-sm max-w-xs">
          Type a description or upload a photo to find similar fashion items using AI-powered visual search
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <Layers className="text-zinc-600" size={28} />
        </div>
        <h3 className="text-zinc-400 font-medium mb-1">No results found</h3>
        <p className="text-zinc-600 text-sm">Try a different search term or image</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </h2>
          {query && (
            <p className="text-zinc-500 text-sm mt-0.5">
              for <span className="text-zinc-300">"{query}"</span>
            </p>
          )}
        </div>
        <span className="text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
          Sorted by similarity
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((r, i) => (
          <ResultCard key={r.id} result={r} index={i} />
        ))}
      </div>
    </div>
  );
}
