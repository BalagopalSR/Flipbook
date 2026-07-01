"use client";

import { FlipbookViewer } from "@/components/viewer/FlipbookViewer";
import type { Flipbook } from "@/types/flipbook";

interface LivePreviewProps {
  flipbook: Flipbook;
}

export function LivePreview({ flipbook }: LivePreviewProps) {
  return (
    <div className="h-[calc(100vh-8rem)] min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <FlipbookViewer flipbook={flipbook} />
    </div>
  );
}
