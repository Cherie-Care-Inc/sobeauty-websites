import type { DayHours, Lang } from "../site-content";

export const initials = (name: string): string =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

/** "09:00" → "9h" (fr) / "9:00" (en) */
export const hour = (hhmm: string, lang: Lang): string => {
  const [h, m] = hhmm.split(":");
  if (lang === "en") return `${h}:${m ?? "00"}`;
  return m && m !== "00" ? `${Number(h)}h${m}` : `${Number(h)}h`;
};

export const rangesLabel = (ranges: [string, string][], lang: Lang, closed: string): string =>
  ranges.length ? ranges.map(([a, b]) => (lang === "en" ? `${hour(a, lang)} to ${hour(b, lang)}` : `${hour(a, lang)} à ${hour(b, lang)}`)).join(lang === "en" ? ", " : " et ") : closed;

/** Day index Monday = 0 … Sunday = 6, from a JS Date. */
export const todayIndex = (): number => (new Date().getDay() + 6) % 7;

export const todayHours = (hours: DayHours[]): DayHours | undefined => hours.find((h) => h.day === todayIndex());

/** Keeps one dash style out of the copy: em/en dashes become commas. */
export const cleanDashes = (s: string): string => s.replace(/\s*[—–]\s*/g, ", ").replace(/,\s*,/g, ", ");
