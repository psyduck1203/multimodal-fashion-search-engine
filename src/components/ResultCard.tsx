import { useState } from "react";
import { Tag, Info } from "lucide-react";
import { SearchResult, getImageUrl } from "../lib/api";

interface Props {
  result: SearchResult;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "t-shirt": "bg-sky-500/20 text-sky-300",
  jeans: "bg-blue-500/20 text-blue-300",
  dress: "bg-rose-500/20 text-rose-300",
  jacket: "bg-amber-500/20 text-amber-300",
  sneakers: "bg-emerald-500/20 text-emerald-300",
  hoodie: "bg-slate-500/20 text-slate-300",
  skirt: "bg-pink-500/20 text-pink-300",
  shirt: "bg-cyan-500/20 text-cyan-300",
  coat: "bg-orange-500/20 text-orange-300",
  shorts: "bg-green-500/20 text-green-300",
};

function SimilarityBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-sky-500" : "bg-zinc-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-zinc-500 text-xs">Match</span>
        <span className={`text-xs font-semibold ${pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-sky-400" : "text-zinc-400"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultCard({ result, index }: Props) {
  const [imgError, setImgError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const categoryClass = CATEGORY_COLORS[result.category] || "bg-zinc-700/40 text-zinc-300";

  return (
    <div
      className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden">
        {!imgError ? (
          <img
            src={getImageUrl(result.image_url)}
            alt={result.description}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
            <Tag size={32} />
            <span className="text-xs mt-2">{result.category}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 right-2 flex gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryClass}`}>
            {result.category}
          </span>
        </div>

        <button
          className="absolute top-2 left-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info size={14} />
        </button>

        {showTooltip && (
          <div className="absolute top-10 left-2 right-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 text-xs text-zinc-300 z-10">
            {result.description}
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">{result.description}</p>
        <SimilarityBar score={result.similarity} />
      </div>
    </div>
  );
}
