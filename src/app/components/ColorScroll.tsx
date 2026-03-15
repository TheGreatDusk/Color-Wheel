import { useRef } from "react";
import { useNavigate } from "react-router";
import { colorsData } from "../../utils/colors";

// Sort colors by hue for the spectrum scroll
const sorted = [...colorsData].sort((a, b) => {
  const hueA = a.hsl.h;
  const hueB = b.hsl.h;
  if (hueA !== hueB) return hueA - hueB;
  return a.hsl.l - b.hsl.l;
});

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export function ColorScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white border-t border-gray-200">
      {/* Rainbow gradient bar */}
      <div
        className="w-full h-2"
        style={{
          background:
            "linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #00FFFF, #0000FF, #8B00FF, #FF00FF, #FF0000)",
        }}
      />
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-widest select-none">
          Color Spectrum
        </span>
        <span className="text-xs text-gray-400">{sorted.length} colors</span>
      </div>

      {/* Scrollable color strip */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-thin scroll-smooth pb-3 px-4 gap-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}
      >
        {sorted.map((color) => {
          const textColor = getTextColor(color.hex);
          return (
            <button
              key={color.id}
              onClick={() => navigate(`/color/${color.id}`)}
              title={`${color.name} — ${color.hex}`}
              className="flex-shrink-0 flex flex-col items-center justify-between rounded-lg overflow-hidden border border-black/10 hover:scale-105 hover:shadow-lg transition-all duration-150 cursor-pointer group"
              style={{
                backgroundColor: color.hex,
                width: "64px",
                height: "72px",
              }}
            >
              <div className="w-full flex-1 flex items-center justify-center px-1 pt-2">
                <span
                  className="text-center leading-tight"
                  style={{
                    color: textColor,
                    fontSize: "9px",
                    fontWeight: 600,
                    opacity: 0.85,
                    wordBreak: "break-word",
                    lineHeight: 1.2,
                  }}
                >
                  {color.name}
                </span>
              </div>
              <div
                className="w-full py-1 px-1 text-center"
                style={{
                  backgroundColor: "rgba(0,0,0,0.18)",
                }}
              >
                <span
                  className="font-mono"
                  style={{ color: "#fff", fontSize: "8px", opacity: 0.9 }}
                >
                  {color.hex}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
