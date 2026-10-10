import type { ComponentType } from "react";
import type { Lang } from "../site-content";
import type { SiteData } from "../lib/site-data";

export interface LayoutProps {
  data: SiteData;
  setLang: (lang: Lang) => void;
}

/**
 * A layout is three page components consuming the same SiteData. Each decides
 * its own section order and styling, renders a block only when its data
 * exists, and paints immediately (no scroll-gated content).
 */
export interface Layout {
  Home: ComponentType<LayoutProps>;
  Services: ComponentType<LayoutProps>;
  Contact: ComponentType<LayoutProps>;
}
