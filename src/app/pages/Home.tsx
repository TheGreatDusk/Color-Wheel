import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowRight, Sparkles, Star } from "lucide-react";
import { colorsData } from "../../utils/colors";
import { ColorCard } from "../components/ColorCard";

export function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof colorsData>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const featuredColors = colorsData.filter((c) => c.featured);
  const newColors = colorsData.filter((c) => c.isNew);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const lower = value.toLowerCase().replace("#", "");
    const filtered = colorsData.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.hex.toLowerCase().replace("#", "").includes(lower) ||
        c.category.toLowerCase().includes(lower) ||
        c.tags.some((t) => t.toLowerCase().includes(lower))
    );
    setResults(filtered.slice(0, 8));
    setShowResults(true);
  };

  const handleSelect = (id: string) => {
    setQuery("");
    setShowResults(false);
    navigate(`/color/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].id);
    } else if (query.trim()) {
      navigate(`/colors?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Hero gradient uses a few featured colors
  const heroGradient = `linear-gradient(135deg, #DC143C 0%, #FF7F00 20%, #FFD700 40%, #00A86B 60%, #4B0082 80%, #FF00FF 100%)`;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0a" }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: heroGradient }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full shadow-2xl border-4 border-white/20"
              style={{
                background: "conic-gradient(#FF0000, #FF7F00, #FFFF00, #00FF00, #00FFFF, #0000FF, #8B00FF, #FF00FF, #FF0000)"
              }}
            />
          </div>
          <h1 className="text-white mb-4" style={{ fontWeight: 800, fontSize: "3rem", lineHeight: 1.1 }}>
            The Color Encyclopedia
          </h1>
          <p className="text-gray-400 mb-10" style={{ fontSize: "1.1rem", maxWidth: "480px", margin: "0 auto 2.5rem" }}>
            Explore {colorsData.length} curated colors — their history, origins, RGB values, and more.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowResults(false), 150)}
                  onFocus={() => query && setShowResults(true)}
                  placeholder="Search by name, #hex, or category…"
                  className="w-full pl-12 pr-16 py-4 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 text-white placeholder-gray-400 transition backdrop-blur"
                  style={{ fontSize: "1rem" }}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-xl text-sm hover:bg-gray-100 transition"
                  style={{ fontWeight: 600 }}
                >
                  Search
                </button>
              </div>
            </form>
            {showResults && results.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">
                {results.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={() => handleSelect(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 border border-black/10 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{c.hex} · {c.category}</div>
                    </div>
                    <span className="text-xs text-gray-300 font-mono">#{c.number}</span>
                  </button>
                ))}
                <button
                  onMouseDown={() => navigate(`/colors?q=${encodeURIComponent(query)}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 text-sm"
                >
                  View all results <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => navigate("/colors")}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Browse All Colors <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/picker")}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Color Picker <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Colors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-gray-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Featured Colors
            </h2>
          </div>
          <button
            onClick={() => navigate("/colors")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredColors.map((color) => (
            <ColorCard key={color.id} color={color} variant="featured" />
          ))}
        </div>
      </section>

      {/* New Colors */}
      {newColors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-gray-900" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                Recently Added
              </h2>
            </div>
            <button
              onClick={() => navigate("/colors?filter=new")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {newColors.map((color) => (
              <ColorCard key={color.id} color={color} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Categories quick links */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Neutral"].map((cat) => {
              const sample = colorsData.find((c) => c.category === cat);
              return (
                <button
                  key={cat}
                  onClick={() => navigate(`/colors?category=${cat}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 transition-all text-sm text-gray-700 shadow-sm hover:shadow"
                >
                  {sample && (
                    <div
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: sample.hex }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
