"use client";

import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/common/Button";
import { getButtonRadius } from "@/lib/utils/cn";
import type { FlipbookSettings } from "@/types/flipbook";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  settings: FlipbookSettings;
}

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  settings,
}: ZoomControlsProps) {
  const radius = getButtonRadius(settings.buttonStyle);
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={onZoomOut} aria-label="Zoom out" className={radius}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="px-1 text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
      <Button variant="ghost" size="sm" onClick={onZoomIn} aria-label="Zoom in" className={radius}>
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}
