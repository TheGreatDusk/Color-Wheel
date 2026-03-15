import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { colorsData } from "../../utils/colors";
import { ColorCard } from "../components/ColorCard";

const CATEGORIES = ["All", "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Neutral"];

export function ColorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [showNew, setShowNew] = useState(searchParams.get("filter") === "new");
  // we no longer support arbitrary sorting – the grid is always numbered sequentially
  // and when names clash we keep the highest-numbered variant so that the darker/more‑recent
  // version (e.g. Snowflake #17) is what shows up.

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    const filter = searchParams.get("filter");
    if (q) setQuery(q);
    if (cat) setActiveCategory(cat);
    if (filter === "new") setShowNew(true);
  }, [searchParams]);

  let filtered = colorsData
    .filter((c) => {
      if (showNew && !c.isNew) return false;
      if (activeCategory !== "All" && c.category !== activeCategory) return false;
      if (query.trim()) {
        const lower = query.toLowerCase().replace("#", "");
        return (
          c.name.toLowerCase().includes(lower) ||
          c.hex.toLowerCase().replace("#", "").includes(lower) ||
          c.category.toLowerCase().includes(lower) ||
          c.tags.some((t) => t.toLowerCase().includes(lower)) ||
          c.origin.toLowerCase().includes(lower)
        );
      }
      return true;
    })
// always sort by the assigned number
      .sort((a, b) => a.number - b.number);

  // remove any entries with a duplicated number; keep first (lowest) one.
    if (filtered.length > 0) {
    const seenNum = new Set<number>();
    filtered = filtered.filter((c) => {
      if (seenNum.has(c.number)) return false;
      seenNum.add(c.number);
      return true;
    });
  }

  function clearFilters() {
    setQuery("");
    setActiveCategory("All");
    setShowNew(false);
    setSearchParams({});
  }


  const hasFilters = query || activeCategory !== "All" || showNew;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2" style={{ fontSize: "2rem", fontWeight: 800 }}>
          All Colors
        </h1>
        <p className="text-gray-500">
          {filtered.length} of {colorsData.length} colors
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                if (e.target.value) p.set("q", e.target.value);
                else p.delete("q");
                return p;
              });
            }}
            placeholder="Search colors, hex, origin…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-gray-400 text-sm text-gray-800 placeholder-gray-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* sort UI removed – grid is always numbered */}
          <button
            onClick={() => setShowNew(!showNew)}
            className={`px-3 py-2.5 rounded-xl text-sm border transition ${
              showNew
                ? "bg-violet-100 text-violet-700 border-violet-200"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
            style={{ fontWeight: showNew ? 600 : 400 }}
          >
            New
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const sample = cat === "All" ? null : colorsData.find((c) => c.category === cat);
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  if (cat === "All") p.delete("category");
                  else p.set("category", cat);
                  return p;
                });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${
                activeCategory === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
              style={{ fontWeight: activeCategory === cat ? 600 : 400 }}
            >
              {sample && (
                <div
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ backgroundColor: sample.hex }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-gray-600 mb-2" style={{ fontWeight: 600 }}>No colors found</h3>
          <p className="text-gray-400 text-sm">Try a different search or clear the filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((color) => (
            <ColorCard key={color.id} color={color} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}
