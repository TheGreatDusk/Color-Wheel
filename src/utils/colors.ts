import raw from "../data/colors.json";

// utility functions copied from ColorDetail for consistency
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hexToCmyk(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

// ensure every color has accurate derived values and provide sorting
export interface ColorEntry {
  id: string;
  number: number;
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
  origin: string;
  year?: string;
  category: string;
  description: string;
  featured: boolean;
  isNew: boolean;
  tags: string[];
}

export const colorsData: ColorEntry[] = (raw as any[])
  .map((c) => {
    const { r, g, b } = hexToRgb(c.hex);
    // ensure tags are lowercased, trimmed, and unique
    const rawTags: string[] = c.tags || [];
    const tags = Array.from(new Set(rawTags.map((t) => t.trim().toLowerCase())));
    return {
      ...c,
      r,
      g,
      b,
      hsl: hexToHsl(c.hex),
      cmyk: hexToCmyk(c.hex),
      tags,
    } as ColorEntry;
  })
  .sort((a, b) => a.number - b.number);

// Color parsing functions
export function parseColor(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim().toLowerCase();

  // Hex
  if (/^#?[0-9a-f]{6}$/.test(trimmed) || /^#?[0-9a-f]{3}$/.test(trimmed)) {
    let hex = trimmed.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    return hexToRgb("#" + hex);
  }

  // RGB
  const rgbMatch = trimmed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }

  // HSL
  const hslMatch = trimmed.match(/^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
    else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
    else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
    else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
    else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
    else if (5/6 <= h && h < 1) { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  // CMYK
  const cmykMatch = trimmed.match(/^cmyk\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?,\s*(\d+)%?\)$/);
  if (cmykMatch) {
    const c = parseInt(cmykMatch[1]) / 100;
    const m = parseInt(cmykMatch[2]) / 100;
    const y = parseInt(cmykMatch[3]) / 100;
    const k = parseInt(cmykMatch[4]) / 100;
    return {
      r: Math.round(255 * (1 - c) * (1 - k)),
      g: Math.round(255 * (1 - m) * (1 - k)),
      b: Math.round(255 * (1 - y) * (1 - k))
    };
  }

  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

export function findClosestColor(r: number, g: number, b: number): ColorEntry {
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
  return closest;
}

export { hexToHsl, hexToCmyk };
