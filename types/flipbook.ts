export type FlipbookSourceType =
  | "pdf"
  | "pdf-slides"
  | "images"
  | "google-docs"
  | "google-slides"
  | "url"
  | "ppt"
  | "pptx";

export type FlipbookStatus = "draft" | "published";

export type FlipbookEffect = "flip" | "slide";

/** Maps legacy stored values (e.g. coverflow) to a supported effect. */
export function normalizeFlipbookEffect(effect: string | undefined): FlipbookEffect {
  if (effect === "slide") return "slide";
  return "flip";
}

export type PageMode = "single" | "double";

export type FlipSpeed = "slow" | "normal" | "fast";

export type ShadowIntensity = "none" | "soft" | "medium" | "strong";

export type ToolbarStyle = "minimal" | "classic" | "floating";

export type ButtonStyle = "rounded" | "square" | "pill";

export type PageSizeOption = "auto" | "a4-portrait" | "a4-landscape" | "square" | "custom";

export type ImageFitMode = "fit" | "fill";

export interface Flipbook {
  id: string;
  title: string;
  description?: string;
  sourceType: FlipbookSourceType;
  originalFileName?: string;
  originalFileUrl?: string;
  sourceUrl?: string;
  pageCount: number;
  pages: FlipbookPage[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  status: FlipbookStatus;
  settings: FlipbookSettings;
  analytics: Analytics;
  hotspots?: FlipbookHotspot[];
}

export interface FlipbookPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  sourceType: FlipbookSourceType;
  rotation?: number;
  isCover?: boolean;
}

export interface FlipbookSettings {
  effect: FlipbookEffect;
  pageMode: PageMode;
  flipSpeed: FlipSpeed;
  background: string;
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor?: string;
  logoUrl?: string;
  showLogo: boolean;
  showPagination: boolean;
  showDownload: boolean;
  showShare: boolean;
  showFullscreen: boolean;
  showPrint: boolean;
  showThumbnails: boolean;
  rtl: boolean;
  soundEnabled: boolean;
  autoplay: boolean;
  autoplayInterval: number;
  loopAutoplay: boolean;
  shadowIntensity: ShadowIntensity;
  borderRadius: number;
  toolbarStyle: ToolbarStyle;
  buttonStyle: ButtonStyle;
  /** Tracks PDF page render quality; bumped when render pipeline improves. */
  pageRenderVersion?: number;
  /** When true, flipbook can be opened by anyone with the link (within this app). */
  isPublic?: boolean;
  passwordProtection?: boolean;
  /** Sent only when setting or changing the access password; never stored. */
  accessPassword?: string;
  /** Stored server-side only; never sent to the client. */
  accessPasswordHash?: string;
  /** Populated on API responses when a password is configured. */
  hasAccessPassword?: boolean;
  /** ISO date (YYYY-MM-DD). Viewer is blocked after this day. */
  expiryDate?: string;
  domainRestrictedEmbed?: boolean;
  /** Comma-separated hostnames allowed to embed this flipbook. */
  allowedEmbedDomains?: string;
}

export interface Analytics {
  views: number;
  uniqueViewers: number;
  downloads: number;
  shares: number;
  averageReadTime: number;
  completionRate: number;
  pageViews: Record<string, number>;
}

export interface FlipbookHotspot {
  id: string;
  pageId: string;
  type: "link" | "video" | "image" | "audio" | "cta" | "form" | "product";
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  url?: string;
  content?: string;
}

export interface ConversionProgress {
  current: number;
  total: number;
  message: string;
}

export interface ConversionResult {
  pages: FlipbookPage[];
  coverImage?: string;
  originalFileUrl?: string;
}

export const DEFAULT_SETTINGS: FlipbookSettings = {
  effect: "flip",
  pageMode: "double",
  flipSpeed: "normal",
  background: "#f5f5f0",
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  showLogo: false,
  showPagination: true,
  showDownload: true,
  showShare: true,
  showFullscreen: true,
  showPrint: true,
  showThumbnails: true,
  rtl: false,
  soundEnabled: false,
  autoplay: false,
  autoplayInterval: 3000,
  loopAutoplay: false,
  shadowIntensity: "medium",
  borderRadius: 4,
  toolbarStyle: "classic",
  buttonStyle: "rounded",
  isPublic: true,
  passwordProtection: false,
  domainRestrictedEmbed: false,
};

export const DEFAULT_ANALYTICS: Analytics = {
  views: 0,
  uniqueViewers: 0,
  downloads: 0,
  shares: 0,
  averageReadTime: 0,
  completionRate: 0,
  pageViews: {},
};

export function createDefaultFlipbook(
  partial: Partial<Flipbook> & Pick<Flipbook, "id" | "title" | "sourceType" | "pages">
): Flipbook {
  const now = new Date().toISOString();
  const pages = partial.pages;
  return {
    description: "",
    coverImage: pages[0]?.thumbnailUrl || pages[0]?.imageUrl,
    createdAt: now,
    updatedAt: now,
    status: "draft",
    settings: { ...DEFAULT_SETTINGS, ...partial.settings },
    analytics: { ...DEFAULT_ANALYTICS },
    hotspots: [],
    ...partial,
    pageCount: pages.length,
  };
}
