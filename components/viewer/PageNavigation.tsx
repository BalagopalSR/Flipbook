"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { getButtonRadius } from "@/lib/utils/cn";
import type { FlipbookSettings } from "@/types/flipbook";

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  pageLabel: string;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  settings: FlipbookSettings;
}

export function PageNavigation({
  currentPage,
  totalPages,
  pageLabel,
  onFirst,
  onPrev,
  onNext,
  onLast,
  settings,
}: PageNavigationProps) {
  const radius = getButtonRadius(settings.buttonStyle);
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onFirst}
        disabled={currentPage === 0}
        aria-label="First page"
        className={radius}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrev}
        disabled={currentPage === 0}
        aria-label="Previous page"
        className={radius}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {settings.showPagination && (
        <span className="min-w-[4rem] px-2 text-center text-sm text-slate-600" aria-live="polite">
          {pageLabel} / {totalPages}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next page"
        className={radius}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onLast}
        disabled={currentPage >= totalPages - 1}
        aria-label="Last page"
        className={radius}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
