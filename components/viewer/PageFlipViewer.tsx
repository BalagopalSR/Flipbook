"use client";

import React, { forwardRef, useImperativeHandle, useRef, useCallback, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import type { FlipbookPage, FlipbookSettings } from "@/types/flipbook";
import { getShadowClass } from "@/lib/utils/cn";
import {
  computeFittedPageSize,
  getPageAspectRatio,
  VIEWER_INSET,
} from "@/lib/viewer/computePageSize";

export interface PageFlipRef {
  flipNext: () => void;
  flipPrev: () => void;
  flip: (page: number) => void;
  getCurrentPage: () => number;
}

interface PageFlipViewerProps {
  pages: FlipbookPage[];
  settings: FlipbookSettings;
  onPageChange: (page: number) => void;
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;
}

const Page = forwardRef<HTMLDivElement, { page: FlipbookPage; settings: FlipbookSettings }>(
  ({ page, settings }, ref) => (
    <div ref={ref} className="h-full w-full bg-white">
      <img
        src={page.imageUrl}
        alt={`Page ${page.pageNumber}`}
        width={page.width}
        height={page.height}
        className={`flipbook-page-image h-full w-full object-contain ${getShadowClass(settings.shadowIntensity)}`}
        style={{ borderRadius: settings.borderRadius }}
        draggable={false}
        loading="eager"
        decoding="async"
      />
    </div>
  )
);
Page.displayName = "Page";

export const PageFlipViewer = forwardRef<PageFlipRef, PageFlipViewerProps>(
  ({ pages, settings, onPageChange, zoom, viewportWidth, viewportHeight }, ref) => {
    const bookRef = useRef<{
      pageFlip: () => {
        flipNext: (corner?: string) => void;
        flipPrev: (corner?: string) => void;
        flip: (page: number, corner?: string) => void;
        getCurrentPageIndex: () => number;
      };
    }>(null);

    useImperativeHandle(ref, () => ({
      flipNext: () => bookRef.current?.pageFlip()?.flipNext(),
      flipPrev: () => bookRef.current?.pageFlip()?.flipPrev(),
      flip: (page: number) => bookRef.current?.pageFlip()?.flip(page),
      getCurrentPage: () => bookRef.current?.pageFlip()?.getCurrentPageIndex() ?? 0,
    }));

    const handleFlip = useCallback(
      (e: { data: number }) => {
        if (typeof e.data === "number") onPageChange(e.data);
      },
      [onPageChange]
    );

    const handleInit = useCallback(
      (e: { data: { page?: number } }) => {
        const page = typeof e?.data?.page === "number" ? e.data.page : 0;
        onPageChange(page);
      },
      [onPageChange]
    );

    const speedMap = { slow: 1200, normal: 800, fast: 400 };
    const isSinglePage = settings.pageMode === "single";
    const firstPage = pages[0];

    const { pageWidth, pageHeight } = useMemo(() => {
      if (viewportWidth <= 0 || viewportHeight <= 0) {
        return { pageWidth: 400, pageHeight: 560 };
      }

      return computeFittedPageSize(viewportWidth, viewportHeight, {
        pageAspect: getPageAspectRatio(firstPage?.width, firstPage?.height),
        isDoubleSpread: !isSinglePage,
        padding: VIEWER_INSET,
        zoom,
      });
    }, [viewportWidth, viewportHeight, firstPage?.width, firstPage?.height, isSinglePage, zoom]);

    if (pages.length === 0) return null;

    return (
      <div className="flipbook-container flex h-full w-full items-center justify-center">
        {/* @ts-expect-error react-pageflip types are incomplete */}
        <HTMLFlipBook
          key={`book-${isSinglePage ? "single" : "double"}-${pages.length}-${pageWidth}x${pageHeight}`}
          ref={bookRef}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          minWidth={pageWidth}
          maxWidth={pageWidth}
          minHeight={pageHeight}
          maxHeight={pageHeight}
          showCover={true}
          mobileScrollSupport={true}
          useMouseEvents={true}
          swipeDistance={30}
          flippingTime={speedMap[settings.flipSpeed]}
          usePortrait={isSinglePage}
          startPage={0}
          drawShadow={settings.shadowIntensity !== "none"}
          maxShadowOpacity={
            settings.shadowIntensity === "strong"
              ? 1
              : settings.shadowIntensity === "medium"
                ? 0.6
                : 0.3
          }
          onFlip={handleFlip}
          onInit={handleInit}
          className="flipbook-viewer"
          style={{}}
        >
          {pages.map((page) => (
            <Page key={page.id} page={page} settings={settings} />
          ))}
        </HTMLFlipBook>
      </div>
    );
  }
);
PageFlipViewer.displayName = "PageFlipViewer";
