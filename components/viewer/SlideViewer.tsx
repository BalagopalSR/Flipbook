"use client";

import { useEffect, useRef } from "react";
import type { FlipbookPage, FlipbookSettings } from "@/types/flipbook";
import { getShadowClass } from "@/lib/utils/cn";

interface SlideViewerProps {
  pages: FlipbookPage[];
  settings: FlipbookSettings;
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom: number;
}

export function SlideViewer({ pages, settings, currentPage, onPageChange, zoom }: SlideViewerProps) {
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

  if (pages.length === 0) return null;
  const page = pages[currentPage];

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center"
      style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
    >
      <div
        className={`relative max-h-full max-w-full transition-transform duration-500 ${getShadowClass(settings.shadowIntensity)}`}
        style={{ borderRadius: settings.borderRadius }}
      >
        <img
          src={page.imageUrl}
          alt={`Page ${page.pageNumber}`}
          width={page.width}
          height={page.height}
          className="flipbook-page-image max-h-[76vh] max-w-full object-contain"
          style={{ borderRadius: settings.borderRadius }}
          draggable={false}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}
