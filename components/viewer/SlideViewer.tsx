"use client";

import { useEffect, useRef, useMemo } from "react";
import type { FlipbookPage, FlipbookSettings } from "@/types/flipbook";
import { getShadowClass } from "@/lib/utils/cn";
import {
  computeFittedPageSize,
  getPageAspectRatio,
  VIEWER_INSET,
} from "@/lib/viewer/computePageSize";

interface SlideViewerProps {
  pages: FlipbookPage[];
  settings: FlipbookSettings;
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;
}

export function SlideViewer({
  pages,
  settings,
  currentPage,
  onPageChange,
  zoom,
  viewportWidth,
  viewportHeight,
}: SlideViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage < pages.length - 1) onPageChange(currentPage + 1);
        if (diff < 0 && currentPage > 0) onPageChange(currentPage - 1);
      }
    };
    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, pages.length, onPageChange]);

  const { pageWidth, pageHeight } = useMemo(() => {
    if (viewportWidth <= 0 || viewportHeight <= 0) {
      return { pageWidth: 400, pageHeight: 560 };
    }

    const page = pages[0];
    return computeFittedPageSize(viewportWidth, viewportHeight, {
      pageAspect: getPageAspectRatio(page?.width, page?.height),
      isDoubleSpread: false,
      padding: VIEWER_INSET,
      zoom,
    });
  }, [viewportWidth, viewportHeight, pages, zoom]);

  if (pages.length === 0) return null;
  const page = pages[currentPage];

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        className={`relative ${getShadowClass(settings.shadowIntensity)}`}
        style={{
          borderRadius: settings.borderRadius,
          width: pageWidth,
          height: pageHeight,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <img
          src={page.imageUrl}
          alt={`Page ${page.pageNumber}`}
          width={page.width}
          height={page.height}
          className="flipbook-page-image h-full w-full object-contain"
          style={{ borderRadius: settings.borderRadius }}
          draggable={false}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
