/** Bump this when render settings change to re-process stored flipbooks. */
export const RENDER_QUALITY_VERSION = 3;

/** Display size of one page in the flip viewer (CSS pixels). */
export const VIEWER_PAGE_HEIGHT = 725;
export const VIEWER_PAGE_WIDTH = 518;

/** Target long edge for rendered page bitmaps (sharp on retina + zoom). */
export const TARGET_PAGE_LONG_EDGE = 4800;

/** Pages below this long edge are re-rendered from the stored PDF on open. */
export const MIN_ACCEPTABLE_LONG_EDGE = 4000;

export function getPdfRenderScale(viewport: { width: number; height: number }): number {
  const longEdge = Math.max(viewport.width, viewport.height);
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 2;
  const target = Math.min(
    TARGET_PAGE_LONG_EDGE,
    Math.ceil(VIEWER_PAGE_HEIGHT * dpr * 5)
  );
  return Math.max(5, target / longEdge);
}

export function needsPageQualityUpgrade(
  pages: { width: number; height: number }[],
  pageRenderVersion?: number
): boolean {
  if (pages.length === 0) return false;
  if (
    pageRenderVersion === undefined ||
    pageRenderVersion < RENDER_QUALITY_VERSION
  ) {
    return true;
  }
  const longest = Math.max(...pages.map((p) => Math.max(p.width, p.height)));
  return longest < MIN_ACCEPTABLE_LONG_EDGE;
}
