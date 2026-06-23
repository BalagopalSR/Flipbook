"use client";

import { cn } from "@/lib/utils/cn";
import type { FlipbookPage } from "@/types/flipbook";
import { X } from "lucide-react";

interface ThumbnailSidebarProps {
  pages: FlipbookPage[];
  currentPage: number;
  onSelect: (index: number) => void;
  open: boolean;
  onClose: () => void;
}

export function ThumbnailSidebar({
  pages,
  currentPage,
  onSelect,
  open,
  onClose,
}: ThumbnailSidebarProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-48 overflow-y-auto border-r border-slate-200 bg-white p-3 shadow-lg",
          "lg:static lg:z-auto lg:shadow-none"
        )}
        aria-label="Page thumbnails"
      >
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <span className="text-sm font-medium text-slate-700">Pages</span>
          <button onClick={onClose} aria-label="Close thumbnails">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => {
                onSelect(index);
                onClose();
              }}
              className={cn(
                "block w-full rounded-lg border-2 p-1 transition-colors",
                currentPage === index
                  ? "border-brand-500 bg-brand-50"
                  : "border-transparent hover:border-slate-300"
              )}
              aria-label={`Page ${page.pageNumber}`}
              aria-current={currentPage === index ? "page" : undefined}
            >
              <img
                src={page.thumbnailUrl || page.imageUrl}
                alt={`Thumbnail page ${page.pageNumber}`}
                className="w-full rounded object-cover"
                loading="lazy"
              />
              <span className="mt-1 block text-center text-xs text-slate-500">
                {page.pageNumber}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
