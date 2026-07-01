"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Flipbook, FlipbookEffect } from "@/types/flipbook";
import { normalizeFlipbookEffect } from "@/types/flipbook";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { PageFlipViewer, type PageFlipRef } from "./PageFlipViewer";
import { SlideViewer } from "./SlideViewer";
import { FlipbookToolbar } from "./FlipbookToolbar";
import { ThumbnailSidebar } from "./ThumbnailSidebar";
import { ShareModal } from "@/components/share/ShareModal";
import { useFlipbookViewport } from "./useFlipbookViewport";
import { trackFlipbookView, trackPageView, trackDownload } from "@/lib/analytics/analyticsTracker";
import { exportFlipbookToFile } from "@/lib/storage/flipbookExport";
import { addToViewHistory } from "@/lib/storage/viewHistory";
import { useToast } from "@/components/common/Toast";

interface FlipbookViewerProps {
  flipbook: Flipbook | null;
  loading?: boolean;
  error?: string;
  onSettingsChange?: (settings: Partial<Flipbook["settings"]>) => void;
}

export function FlipbookViewer({
  flipbook,
  loading,
  error,
  onSettingsChange,
}: FlipbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [effect, setEffect] = useState<FlipbookEffect>("flip");
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thumbnailsOpen, setThumbnailsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlipRef>(null);
  const shellSize = useFlipbookViewport(containerRef);
  const previewSize = useFlipbookViewport(previewRef);
  const toolbarSize = useFlipbookViewport(toolbarRef);

  const viewportWidth = previewSize.width || shellSize.width;
  const viewportHeight =
    previewSize.height > 0
      ? previewSize.height
      : Math.max(0, shellSize.height - toolbarSize.height);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { showToast } = useToast();

  const settings = flipbook?.settings;
  const pages = flipbook?.pages ?? [];
  const totalPages = pages.length;

  useEffect(() => {
    if (flipbook) {
      setCurrentPage(0);
      setEffect(normalizeFlipbookEffect(flipbook.settings.effect));
      trackFlipbookView(flipbook.id);
      addToViewHistory({
        flipbookId: flipbook.id,
        title: flipbook.title,
        coverImage: flipbook.coverImage,
      });
    }
  }, [flipbook]);

  // Reset page when view mode changes (e.g. customize panel toggles single/double)
  useEffect(() => {
    setCurrentPage(0);
  }, [settings?.pageMode, effect]);

  useEffect(() => {
    if (flipbook && pages[currentPage]) {
      trackPageView(flipbook.id, pages[currentPage].id);
    }
  }, [currentPage, flipbook, pages]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(page, totalPages - 1));
      if (effect === "flip") {
        pageFlipRef.current?.flip(clamped);
      } else {
        setCurrentPage(clamped);
      }
    },
    [totalPages, effect]
  );

  const handlePageFlip = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getPageLabel = useCallback(() => {
    const page = pages[currentPage];
    if (!page) return "1";
    if (
      effect === "flip" &&
      settings?.pageMode === "double" &&
      currentPage > 0 &&
      currentPage < totalPages - 1
    ) {
      const right = pages[currentPage + 1];
      if (right) return `${page.pageNumber}-${right.pageNumber}`;
    }
    return String(page.pageNumber);
  }, [pages, currentPage, effect, settings?.pageMode, totalPages]);

  const goNext = useCallback(() => {
    if (effect === "flip") {
      if (settings?.rtl) pageFlipRef.current?.flipPrev();
      else pageFlipRef.current?.flipNext();
    } else if (settings?.rtl) {
      goToPage(currentPage - 1);
    } else {
      goToPage(currentPage + 1);
    }
  }, [effect, settings?.rtl, currentPage, goToPage]);

  const goPrev = useCallback(() => {
    if (effect === "flip") {
      if (settings?.rtl) pageFlipRef.current?.flipNext();
      else pageFlipRef.current?.flipPrev();
    } else if (settings?.rtl) {
      goToPage(currentPage + 1);
    } else {
      goToPage(currentPage - 1);
    }
  }, [effect, settings?.rtl, currentPage, goToPage]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Home") goToPage(0);
      if (e.key === "End") goToPage(totalPages - 1);
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        if (shareOpen) setShareOpen(false);
        if (thumbnailsOpen) setThumbnailsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, goToPage, totalPages, isFullscreen, shareOpen, thumbnailsOpen]);

  useEffect(() => {
    if (!settings?.autoplay || !flipbook) return;
    autoplayRef.current = setInterval(() => {
      if (effect === "flip") {
        if (settings.rtl) pageFlipRef.current?.flipPrev();
        else pageFlipRef.current?.flipNext();
      } else {
        setCurrentPage((prev) => {
          const next = settings.rtl ? prev - 1 : prev + 1;
          if (next >= totalPages) {
            if (settings.loopAutoplay) return 0;
            return prev;
          }
          if (next < 0) {
            if (settings.loopAutoplay) return totalPages - 1;
            return prev;
          }
          return next;
        });
      }
    }, settings.autoplayInterval);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [settings?.autoplay, settings?.autoplayInterval, settings?.loopAutoplay, settings?.rtl, flipbook, totalPages, effect]);

  useEffect(() => {
    if (!isFullscreen) return;
    const el = containerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
    return () => {
      if (document.fullscreenElement) document.exitFullscreen();
    };
  }, [isFullscreen]);

  const handleEffectChange = (newEffect: FlipbookEffect) => {
    setEffect(newEffect);
    onSettingsChange?.({ effect: newEffect });
  };

  const handleDownload = async () => {
    if (!flipbook) return;
    trackDownload(flipbook.id);
    try {
      await exportFlipbookToFile(flipbook);
      showToast("Flipbook exported! Send this file to others to share.", "success");
    } catch {
      showToast("Export failed. Please try again.", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingState message="Loading flipbook..." />;
  if (error) return <ErrorState message={error} />;
  if (!flipbook) return <EmptyState title="No flipbook" description="Upload content to create a flipbook." />;
  if (pages.length === 0) return <EmptyState title="Empty flipbook" description="This flipbook has no pages." />;

  return (
    <div
      ref={containerRef}
      className={`flex h-full min-h-0 flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900" : ""}`}
      style={{ background: isFullscreen ? "#1e293b" : settings?.background }}
    >
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {settings?.showThumbnails && (
          <ThumbnailSidebar
            pages={pages}
            currentPage={currentPage}
            onSelect={goToPage}
            open={thumbnailsOpen}
            onClose={() => setThumbnailsOpen(false)}
          />
        )}
        <div
          ref={previewRef}
          className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-6 py-4"
        >
          {effect === "flip" && settings && (
            <PageFlipViewer
              ref={pageFlipRef}
              pages={pages}
              settings={settings}
              onPageChange={handlePageFlip}
              zoom={zoom}
              viewportWidth={viewportWidth}
              viewportHeight={viewportHeight}
            />
          )}
          {effect === "slide" && settings && (
            <SlideViewer
              pages={pages}
              settings={settings}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              zoom={zoom}
              viewportWidth={viewportWidth}
              viewportHeight={viewportHeight}
            />
          )}
        </div>
      </div>

      {settings && (
        <div ref={toolbarRef} className="shrink-0">
          <FlipbookToolbar
          flipbook={flipbook}
          currentPage={currentPage}
          totalPages={totalPages}
          pageLabel={getPageLabel()}
          effect={effect}
          zoom={zoom}
          isFullscreen={isFullscreen}
          thumbnailsOpen={thumbnailsOpen}
          settings={settings}
          onFirst={() => goToPage(0)}
          onPrev={goPrev}
          onNext={goNext}
          onLast={() => goToPage(totalPages - 1)}
          onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
          onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onToggleThumbnails={() => setThumbnailsOpen(!thumbnailsOpen)}
          onEffectChange={handleEffectChange}
          onShare={() => setShareOpen(true)}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
        </div>
      )}

      {flipbook && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          flipbookId={flipbook.id}
          title={flipbook.title}
          onExport={handleDownload}
        />
      )}
    </div>
  );
}
