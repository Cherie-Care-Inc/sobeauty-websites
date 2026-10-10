/**
 * Colour helpers for the builder: hex ⇄ HSL, WCAG contrast, and the
 * adjustments that keep a member's brand colour readable on any template.
 */

export const normalizeHex = (input: string): string | null => {
  const s = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(s)) return `#${s.split("").map((c) => c + c).join("").toUpperCase()}`;
  if (/^[0-9a-f]{6}$/i.test(s)) return `#${s.toUpperCase()}`;
  return null;
};

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const toHex = (r: number, g: number, b: number): string =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();

export const luminance = (hex: string): number => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string): number => {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

export const toHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = toRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
};

export const fromHsl = (h: number, s: number, l: number): string => {
  if (s === 0) return toHex(l * 255, l * 255, l * 255);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return toHex(f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255);
};

/** Mix two colours (t = 0 → a, 1 → b). */
export const mix = (a: string, b: string, t: number): string => {
  const [r1, g1, b1] = toRgb(a), [r2, g2, b2] = toRgb(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};

/**
 * Move `fg` lightness away from `bg` until the contrast reaches `min`
 * (keeps hue and saturation). Returns the original when it already passes.
 */
export const ensureContrast = (fg: string, bg: string, min = 4.5): string => {
  if (contrast(fg, bg) >= min) return fg;
  const [h, s, l0] = toHsl(fg);
  const darkBg = luminance(bg) < 0.4;
  let best = fg, bestRatio = contrast(fg, bg);
  for (let i = 1; i <= 40; i++) {
    const l = darkBg ? Math.min(1, l0 + i * 0.02) : Math.max(0, l0 - i * 0.02);
    const c = fromHsl(h, s, l);
    const r = contrast(c, bg);
    if (r > bestRatio) { best = c; bestRatio = r; }
    if (r >= min) return c;
  }
  return best;
};

/** Text colour for a filled button: white or near-black, whichever reads better. */
export const onColor = (bg: string, light = "#FFFFFF", dark = "#111111"): string =>
  contrast(light, bg) >= contrast(dark, bg) ? light : dark;

/** A soft tint of `accent` for backgrounds, legible under `fg`. */
export const softOf = (accent: string, pageBg: string): string => mix(pageBg, accent, luminance(pageBg) < 0.4 ? 0.22 : 0.14);
