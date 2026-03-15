import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Copy, Check, Tag } from "lucide-react";
import { useState } from "react";
import { colorsData } from "../../utils/colors";

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}


function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition text-sm"
      title={`Copy ${label}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function ColorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const color = colorsData.find((c) => c.id === id);

  if (!color) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h1 className="text-gray-900 mb-2">Color not found</h1>
        <p className="text-gray-500 mb-6">The color <code className="bg-gray-100 px-2 py-0.5 rounded">{id}</code> doesn't exist in our database.</p>
        <button
          onClick={() => navigate("/colors")}
          className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-700 transition"
        >
          Browse All Colors
        </button>
      </div>
    );
  }

  const textColor = getTextColor(color.hex);
  const hsl = color.hsl;
  const cmyk = color.cmyk;

  // Related colors: same category
  const related = colorsData
    .filter((c) => c.category === color.category && c.id !== color.id)
    .slice(0, 6);

  // Adjacent colors by number
  const prev = colorsData.find((c) => c.number === color.number - 1);
  const next = colorsData.find((c) => c.number === color.number + 1);

  // Variants: other entries sharing the same name
  const variants = colorsData
    .filter((c) => c.name === color.name)
    .sort((a, b) => a.number - b.number);
  const variantIndex = variants.findIndex((c) => c.id === color.id);
  // wrap around so there are always two arrows when multiple variants exist
  const variantPrev = variants[(variantIndex - 1 + variants.length) % variants.length];
  const variantNext = variants[(variantIndex + 1) % variants.length];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-500">
          <button onClick={() => navigate("/colors")} className="hover:text-gray-900 transition-colors">Colors</button>
        </span>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{color.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Color swatch + values */}
        <div>
          {/* Main swatch */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl mb-6"
            style={{
              backgroundColor: color.hex,
              aspectRatio: "4/3",
            }}
          >
            {/* Number */}
            <div
              className="absolute top-4 left-4 font-mono text-sm opacity-60"
              style={{ color: textColor }}
            >
              #{color.number.toString().padStart(3, "0")}
            </div>

            {/* Variant arrows – if there are multiple entries sharing the name we always render
                a left *and* right control (wrap‑around logic above guarantees they point at the
                correct neighbors).  otherwise no arrows at all. */}
            {variants.length > 1 && (
              <>
                <button
                  onClick={() => { navigate(`/color/${variantPrev.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition"
                  style={{ color: textColor }}
                  aria-label="Previous variant"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { navigate(`/color/${variantNext.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition"
                  style={{ color: textColor }}
                  aria-label="Next variant"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              {color.featured && (
                <span className="bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                  ★ Featured
                </span>
              )}
              {color.isNew && (
                <span className="bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                  NEW
                </span>
              )}
            </div>

            {/* Color name on swatch */}
            <div className="absolute bottom-0 left-0 right-0 p-6"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)`,
              }}
            >
              <h1 className="text-white mb-1" style={{ fontWeight: 800, fontSize: "2rem", lineHeight: 1.1 }}>
                {color.name}
              </h1>
              <span className="font-mono text-white/80" style={{ fontSize: "1rem" }}>{color.hex}</span>
            </div>
          </div>

          {/* Copy buttons */}
          <div
            className="flex flex-wrap gap-2 mb-6 p-4 rounded-2xl"
            style={{ color: textColor, backgroundColor: color.hex + "22", border: `1.5px solid ${color.hex}44` }}
          >
            <CopyButton value={color.hex} label={color.hex} />
            <CopyButton value={`rgb(${color.r}, ${color.g}, ${color.b})`} label="RGB" />
            <CopyButton value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} label="HSL" />
            <CopyButton value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} label="CMYK" />
          </div>

          {/* Color values */}
          <div className="grid grid-cols-2 gap-3">
            {/* HEX */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>HEX</div>
              <div className="font-mono text-gray-800" style={{ fontWeight: 700, fontSize: "1.1rem" }}>{color.hex}</div>
            </div>

            {/* RGB */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>RGB</div>
              <div className="font-mono text-gray-800" style={{ fontWeight: 500 }}>
                <span className="text-red-500">{color.r}</span>
                <span className="text-gray-400"> / </span>
                <span className="text-green-500">{color.g}</span>
                <span className="text-gray-400"> / </span>
                <span className="text-blue-500">{color.b}</span>
              </div>
            </div>

            {/* HSL */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>HSL</div>
              <div className="font-mono text-gray-800 text-sm" style={{ fontWeight: 500 }}>
                {hsl.h}° / {hsl.s}% / {hsl.l}%
              </div>
            </div>

            {/* CMYK */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>CMYK</div>
              <div className="font-mono text-gray-800 text-sm" style={{ fontWeight: 500 }}>
                {cmyk.c} / {cmyk.m} / {cmyk.y} / {cmyk.k}
              </div>
            </div>
          </div>

          {/* RGB Bars */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-3">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>RGB Channels</div>
            <div className="space-y-2.5">
              {[
                { label: "R", value: color.r, color: "#ef4444" },
                { label: "G", value: color.g, color: "#22c55e" },
                { label: "B", value: color.b, color: "#3b82f6" },
              ].map(({ label, value, color: barColor }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-3">{label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(value / 255) * 100}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-600 w-7 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: color.hex + "22",
                color: color.hex,
                border: `1.5px solid ${color.hex}44`,
                fontWeight: 600,
              }}
            >
              {color.category}
            </span>
          </div>

          <h2 className="text-gray-900 mb-1" style={{ fontWeight: 800, fontSize: "1.75rem" }}>
            {color.name}
          </h2>
          <p className="text-gray-500 text-sm mb-6 font-mono">{color.hex}</p>

          <p className="text-gray-700 leading-relaxed mb-8" style={{ fontSize: "0.95rem" }}>
            {color.description}
          </p>

          {/* Origin & Year */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>Origin & Etymology</div>
            <p className="text-gray-700 text-sm leading-relaxed">{color.origin}</p>
            {color.year && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-400">First recorded use:</span>
                <span className="text-sm text-gray-700 font-mono" style={{ fontWeight: 600 }}>{color.year}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1" style={{ fontWeight: 600 }}>
              <Tag className="w-3 h-3" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {color.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/colors?q=${tag}`)}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition"
                  style={{ fontWeight: 500 }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Shades / Tints preview */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>
              Tints & Shades
            </div>
            <div className="flex rounded-xl overflow-hidden h-10 border border-black/10">
              {[80, 60, 40, 20, 0, -20, -40, -60, -80].map((lightAdj, i) => {
                const r = Math.min(255, Math.max(0, color.r + lightAdj * 1.5));
                const g = Math.min(255, Math.max(0, color.g + lightAdj * 1.5));
                const b = Math.min(255, Math.max(0, color.b + lightAdj * 1.5));
                const hexAdjusted = `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
                return (
                  <div
                    key={i}
                    className="flex-1 cursor-pointer hover:flex-[2] transition-all duration-200"
                    style={{ backgroundColor: hexAdjusted }}
                    title={hexAdjusted}
                  />
                );
              })}
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="grid grid-cols-2 gap-3">
            {prev ? (
              <button
                onClick={() => navigate(`/color/${prev.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-400 bg-white transition group text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 border border-black/10"
                  style={{ backgroundColor: prev.hex }}
                />
                <div>
                  <div className="text-xs text-gray-400">← Previous</div>
                  <div className="text-sm text-gray-700" style={{ fontWeight: 600 }}>{prev.name}</div>
                </div>
              </button>
            ) : <div />}
            {next ? (
              <button
                onClick={() => navigate(`/color/${next.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-400 bg-white transition group text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 border border-black/10"
                  style={{ backgroundColor: next.hex }}
                />
                <div>
                  <div className="text-xs text-gray-400">Next →</div>
                  <div className="text-sm text-gray-700" style={{ fontWeight: 600 }}>{next.name}</div>
                </div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Related Colors */}
      {related.length > 0 && (
        <div className="mt-16">
          <h3 className="text-gray-900 mb-6" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
            More {color.category} Colors
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {related.map((c) => {
              return (
                <button
                  key={c.id}
                  onClick={() => navigate(`/color/${c.id}`)}
                  className="group overflow-hidden rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left"
                >
                  <div
                    className="w-full"
                    style={{ backgroundColor: c.hex, height: "64px" }}
                  />
                  <div className="p-2 bg-white">
                    <div className="text-xs text-gray-700 truncate" style={{ fontWeight: 600 }}>
                      {c.name}
                    </div>
                    <div className="text-xs font-mono text-gray-400">{c.hex}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
