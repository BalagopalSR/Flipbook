"use client";

import {
  Download,
  Share2,
  Printer,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { getButtonRadius } from "@/lib/utils/cn";
import type { Flipbook, FlipbookEffect, FlipbookSettings } from "@/types/flipbook";
import { PageNavigation } from "./PageNavigation";
import { ZoomControls } from "./ZoomControls";
import { FullscreenButton } from "./FullscreenButton";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

interface FlipbookToolbarProps {
  flipbook: Flipbook;
  currentPage: number;
  totalPages: number;
  pageLabel: string;
  effect: FlipbookEffect;
  zoom: number;
  isFullscreen: boolean;
  thumbnailsOpen: boolean;
  settings: FlipbookSettings;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onToggleThumbnails: () => void;
  onEffectChange: (effect: FlipbookEffect) => void;
  onShare: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

export function FlipbookToolbar({
  flipbook,
  currentPage,
  totalPages,
  pageLabel,
  effect,
  zoom,
  isFullscreen,
  thumbnailsOpen,
  settings,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onToggleThumbnails,
  onEffectChange,
  onShare,
  onDownload,
  onPrint,
}: FlipbookToolbarProps) {
  const radius = getButtonRadius(settings.buttonStyle);
  const toolbarClass =
    settings.toolbarStyle === "floating"
      ? "mx-4 mb-4 rounded-xl shadow-lg"
      : settings.toolbarStyle === "minimal"
        ? "border-t border-slate-200"
        : "border-t border-slate-200 bg-white";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 ${toolbarClass}`}
      style={{ backgroundColor: settings.toolbarStyle !== "minimal" ? "#fff" : undefined }}
      role="toolbar"
      aria-label="Flipbook controls"
    >
      <div className="flex items-center gap-2">
        {settings.showThumbnails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleThumbnails}
            aria-label="Toggle thumbnails"
            className={radius}
            aria-pressed={thumbnailsOpen}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <ViewModeSwitcher effect={effect} onChange={onEffectChange} settings={settings} />
      </div>

      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        pageLabel={pageLabel}
        onFirst={onFirst}
        onPrev={onPrev}
        onNext={onNext}
        onLast={onLast}
        settings={settings}
      />

      <div className="flex items-center gap-1">
        <ZoomControls
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          settings={settings}
        />
        {settings.showDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            aria-label="Export flipbook"
            title="Export flipbook package to share with others"
            className={radius}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {settings.showPrint && (
          <Button variant="ghost" size="sm" onClick={onPrint} aria-label="Print" className={radius}>
            <Printer className="h-4 w-4" />
          </Button>
        )}
        {settings.showShare && (
          <Button variant="ghost" size="sm" onClick={onShare} aria-label="Share" className={radius}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        {settings.showFullscreen && (
          <FullscreenButton
            isFullscreen={isFullscreen}
            onToggle={onToggleFullscreen}
            settings={settings}
          />
        )}
      </div>
    </div>
  );
}
