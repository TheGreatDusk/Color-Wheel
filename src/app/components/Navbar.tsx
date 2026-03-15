import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Search, Menu, X } from "lucide-react";
import { colorsData } from "../../utils/colors";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof colorsData>([]);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    setResults(filtered.slice(0, 6));
    setShowResults(true);
  };

  const handleSelect = (id: string) => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    navigate(`/color/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].id);
    }
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow"
              style={{
                background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)"
              }}
            />
            <span className="text-gray-900 tracking-tight" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
              colorwheel<span style={{ color: "#8F00FF" }}>.org</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive("/") && location.pathname === "/"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/colors"
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive("/colors")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Colors
            </Link>
            <Link
              to="/picker"
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive("/picker")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Picker
            </Link>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowResults(false), 150)}
                  onFocus={() => query && setShowResults(true)}
                  placeholder="Search colors or #hex…"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 border border-transparent focus:outline-none focus:border-gray-300 focus:bg-white text-sm text-gray-800 placeholder-gray-400 transition"
                />
              </div>
            </form>
            {showResults && results.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                {results.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={() => handleSelect(c.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className="w-6 h-6 rounded-md flex-shrink-0 border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <div className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{c.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{c.hex}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          <Link to="/" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Home</Link>
          <Link to="/colors" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Colors</Link>
          <Link to="/picker" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Picker</Link>
        </div>
      )}
    </nav>
  );
}
