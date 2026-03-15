import { useState } from "react";
import { useNavigate } from "react-router";
import { colorsData, hexToCmyk, hexToHsl, rgbToHex } from "../../utils/colors";
import { Copy, Check } from "lucide-react";

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

function CopyButton({ value, label, isDark }: { value: string; label: string; isDark?: boolean }) {
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-sm ${
        isDark
          ? "bg-white/20 hover:bg-white/30 text-white"
          : "bg-black/10 hover:bg-black/20 text-gray-900"
      }`}
      title={`Copy ${label}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function PickerPage() {
  const [input, setInput] = useState("");
  const [displayHex, setDisplayHex] = useState<string | null>(null);
  const [closestColor, setClosestColor] = useState<any>(null);
  const navigate = useNavigate();

  const handleInputChange = (value: string) => {
    setInput(value);

    // Only parse hex codes for the background
    const hexMatch = value.trim().match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
    if (hexMatch) {
      let hex = value.trim();
      if (!hex.startsWith("#")) hex = "#" + hex;

      // Expand shorthand hex
      if (hex.length === 4) {
        hex = "#" + hex.slice(1).split("").map(c => c + c).join("");
      }

      setDisplayHex(hex);

      // Find closest color
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      let closest = colorsData[0];
      let minDist = Infinity;
      for (const color of colorsData) {
        const dist = Math.sqrt(
          Math.pow(color.r - r, 2) +
          Math.pow(color.g - g, 2) +
          Math.pow(color.b - b, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          closest = color;
        }
      }
      setClosestColor(closest);
    } else {
      setDisplayHex(null);
      setClosestColor(null);
    }
  };

  const isDark = displayHex ? getTextColor(displayHex) === "#ffffff" : false;
  const hsl = displayHex ? hexToHsl(displayHex) : null;
  const cmyk = displayHex ? hexToCmyk(displayHex) : null;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-200 relative"
      style={{
        backgroundColor: displayHex || "#f3f4f6",
        color: displayHex ? getTextColor(displayHex) : "#1f2937",
      }}
    >
      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Header - Hex Input */}
        <div className="text-center mb-12">
          <div className="text-6xl font-bold mb-6 tracking-tight">
            {closestColor ? closestColor.name : "Color Picker"}
          </div>

          {/* Hex Input */}
          <div className="flex justify-center gap-2 mb-2">
            <span
              className="text-3xl font-semibold"
              style={{ opacity: displayHex ? 0.5 : 1 }}
            >
              #
            </span>
            <input
              type="text"
              value={input.replace(/^#?/, "")}
              onChange={(e) => handleInputChange("#" + e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="CDCDCD"
              className={`text-3xl font-semibold w-48 bg-transparent border-b-2 outline-none transition-colors text-center tracking-widest ${
                displayHex
                  ? isDark
                    ? "border-white/50 text-white placeholder-white/30"
                    : "border-black/50 text-black placeholder-black/30"
                  : "border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              style={{
                color: displayHex ? getTextColor(displayHex) : "#1f2937",
              }}
            />
          </div>

          {input && !displayHex && (
            <p
              className="text-sm mt-2"
              style={{ opacity: 0.6 }}
            >
              Invalid hex code. Use format: RRGGBB
            </p>
          )}
        </div>

        {/* Color Details - Show below when hex is valid */}
        {displayHex && (
          <div className="space-y-6">
            {/* Closest Named Color */}
            {closestColor && (
              <div
                className={`rounded-lg p-6 cursor-pointer hover:opacity-80 transition ${
                  isDark ? "bg-white/10 backdrop-blur" : "bg-black/10 backdrop-blur"
                }`}
                onClick={() => navigate(`/color/${closestColor.id}`)}
              >
                <div className="text-sm font-medium mb-3 opacity-70">Closest Named Color</div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 shadow-sm"
                    style={{
                      backgroundColor: closestColor.hex,
                      borderColor: displayHex,
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{closestColor.name}</h3>
                    <p className="text-sm opacity-75">{closestColor.category}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Color Formats */}
            <div
              className={`rounded-lg p-6 ${isDark ? "bg-white/10 backdrop-blur" : "bg-black/10 backdrop-blur"}`}
            >
              <div className="text-sm font-medium mb-4 opacity-70">Color Formats</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">{displayHex}</code>
                  <CopyButton value={displayHex} label="HEX" isDark={isDark} />
                </div>

                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">
                    rgb({parseInt(displayHex.slice(1, 3), 16)}, {parseInt(displayHex.slice(3, 5), 16)},{" "}
                    {parseInt(displayHex.slice(5, 7), 16)})
                  </code>
                  <CopyButton
                    value={`rgb(${parseInt(displayHex.slice(1, 3), 16)}, ${parseInt(
                      displayHex.slice(3, 5),
                      16
                    )}, ${parseInt(displayHex.slice(5, 7), 16)})`}
                    label="RGB"
                    isDark={isDark}
                  />
                </div>

                {hsl && (
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">
                      hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                    </code>
                    <CopyButton
                      value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                      label="HSL"
                      isDark={isDark}
                    />
                  </div>
                )}

                {cmyk && (
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">
                      cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)
                    </code>
                    <CopyButton
                      value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                      label="CMYK"
                      isDark={isDark}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}