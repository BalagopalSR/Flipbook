"use client";

import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/common/Button";
import { getButtonRadius } from "@/lib/utils/cn";
import type { FlipbookSettings } from "@/types/flipbook";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
  settings: FlipbookSettings;
}

export function FullscreenButton({ isFullscreen, onToggle, settings }: FullscreenButtonProps) {
  const radius = getButtonRadius(settings.buttonStyle);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className={radius}
    >
      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
    </Button>
  );
}
