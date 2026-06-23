"use client";

import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import type { FlipbookPage, FlipbookSettings } from "@/types/flipbook";
import { getShadowClass } from "@/lib/utils/cn";
import { VIEWER_PAGE_WIDTH, VIEWER_PAGE_HEIGHT } from "@/lib/converters/renderQuality";

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
}

const PAGE_WIDTH = VIEWER_PAGE_WIDTH;
const PAGE_HEIGHT = VIEWER_PAGE_HEIGHT;
const PAGE_MIN_WIDTH = Math.round(PAGE_WIDTH * 0.7);
const PAGE_MAX_WIDTH = Math.round(PAGE_WIDTH * 2);
const PAGE_MIN_HEIGHT = Math.round(PAGE_HEIGHT * 0.72);
const PAGE_MAX_HEIGHT = Math.round(PAGE_HEIGHT * 1.61);

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
  ({ pages, settings, onPageChange, zoom }, ref) => {
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

    if (pages.length === 0) return null;

    return (
      <div
        className="flipbook-container"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
      >
        {/* @ts-expect-error react-pageflip types are incomplete */}
        <HTMLFlipBook
          key={`book-${isSinglePage ? "single" : "double"}-${pages.length}`}
          ref={bookRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          size="fixed"
          minWidth={PAGE_MIN_WIDTH}
          maxWidth={PAGE_MAX_WIDTH}
          minHeight={PAGE_MIN_HEIGHT}
          maxHeight={PAGE_MAX_HEIGHT}
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
