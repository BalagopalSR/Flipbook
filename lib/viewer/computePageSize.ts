import { VIEWER_PAGE_HEIGHT, VIEWER_PAGE_WIDTH } from "@/lib/converters/renderQuality";

/** Inner gutter for flipbook shadows inside the preview area (px). */
export const VIEWER_INSET = 12;

export interface FittedPageSize {
  pageWidth: number;
  pageHeight: number;
}

export function getPageAspectRatio(pageWidth?: number, pageHeight?: number): number {
  if (pageWidth && pageHeight && pageHeight > 0) {
    return pageWidth / pageHeight;
  }
  return VIEWER_PAGE_WIDTH / VIEWER_PAGE_HEIGHT;
}

/**
 * Fit one page (or a double spread) inside the viewport with equal padding.
 */
export function computeFittedPageSize(
  viewportWidth: number,
  viewportHeight: number,
  options: {
    pageAspect: number;
    isDoubleSpread: boolean;
    padding?: number;
    zoom?: number;
  }
): FittedPageSize {
  const padding = options.padding ?? VIEWER_INSET;
  const zoom = Math.max(0.5, Math.min(options.zoom ?? 1, 2));

  const availW = Math.max(0, viewportWidth - padding * 2);
  const availH = Math.max(0, viewportHeight - padding * 2);

  if (availW <= 0 || availH <= 0) {
    return { pageWidth: VIEWER_PAGE_WIDTH, pageHeight: VIEWER_PAGE_HEIGHT };
  }

  const spreadAspect = options.isDoubleSpread
    ? options.pageAspect * 2
    : options.pageAspect;

  let spreadW = availW;
  let spreadH = spreadW / spreadAspect;

  if (spreadH > availH) {
    spreadH = availH;
    spreadW = spreadH * spreadAspect;
  }

  spreadW *= zoom;
  spreadH *= zoom;

  const pageWidth = options.isDoubleSpread ? spreadW / 2 : spreadW;
  const pageHeight = spreadH;

  return {
    pageWidth: Math.max(120, Math.round(pageWidth)),
    pageHeight: Math.max(160, Math.round(pageHeight)),
  };
}
