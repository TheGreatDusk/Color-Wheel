import { useNavigate } from "react-router";

interface Color {
  id: string;
  number: number;
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  category: string;
  description: string;
  featured: boolean;
  isNew: boolean;
  tags: string[];
}

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

interface ColorCardProps {
  color: Color;
  variant?: "default" | "compact" | "featured";
}

export function ColorCard({ color, variant = "default" }: ColorCardProps) {
  const navigate = useNavigate();
  const textColor = getTextColor(color.hex);

  if (variant === "featured") {
    return (
      <button
        onClick={() => navigate(`/color/${color.id}`)}
        className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
        style={{ backgroundColor: color.hex, minHeight: "200px" }}
      >
        {color.isNew && (
          <span className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
            NEW
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div
            className="text-xs font-mono mb-1 opacity-75"
            style={{ color: textColor }}
          >
            #{color.number.toString().padStart(3, "0")} · {color.hex}
          </div>
          <h3 className="text-xl" style={{ color: textColor, fontWeight: 700 }}>
            {color.name}
          </h3>
          <p
            className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2"
            style={{ color: textColor }}
          >
            {color.description.slice(0, 80)}…
          </p>
        </div>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => navigate(`/color/${color.id}`)}
        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left w-full border border-gray-100"
      >
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 border border-black/10 shadow-sm"
          style={{ backgroundColor: color.hex }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800 truncate" style={{ fontWeight: 600 }}>
              {color.name}
            </span>
            {color.isNew && (
              <span className="flex-shrink-0 text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-mono text-gray-500">{color.hex}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{color.category}</span>
          </div>
        </div>
        <span className="text-xs text-gray-300 flex-shrink-0 font-mono">
          #{color.number}
        </span>
      </button>
    );
  }

  // Default card
  return (
    <button
      onClick={() => navigate(`/color/${color.id}`)}
      className="group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer text-left border border-gray-100"
    >
      <div
        className="relative"
        style={{ backgroundColor: color.hex, height: "100px" }}
      >
        {color.isNew && (
          <span
            className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full"
            style={{ fontWeight: 600 }}
          >
            NEW
          </span>
        )}
        <div className="absolute bottom-2 left-2">
          <span
            className="text-xs font-mono opacity-70"
            style={{ color: textColor }}
          >
            #{color.number}
          </span>
        </div>
      </div>
      <div className="p-3 bg-white">
        <div className="text-sm text-gray-800 truncate" style={{ fontWeight: 600 }}>
          {color.name}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono text-gray-500">{color.hex}</span>
        </div>
      </div>
    </button>
  );
}
