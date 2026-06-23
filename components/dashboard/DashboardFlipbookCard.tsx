"use client";

import Link from "next/link";
import { Eye, Palette, Share2, BarChart3, Copy, Trash2 } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import type { Flipbook } from "@/types/flipbook";
import { cn } from "@/lib/utils/cn";

interface DashboardFlipbookCardProps {
  flipbook: Flipbook;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onShare: (id: string) => void;
}

const sourceLabels: Record<string, string> = {
  pdf: "PDF",
  "pdf-slides": "PDF Slides",
  images: "Images",
  "google-docs": "Google Docs",
  "google-slides": "Google Slides",
  url: "URL",
  ppt: "PPT",
  pptx: "PPTX",
};

export function DashboardFlipbookCard({
  flipbook,
  onDelete,
  onDuplicate,
  onShare,
}: DashboardFlipbookCardProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Card className="group overflow-hidden !p-0 transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] bg-slate-100">
        {flipbook.coverImage ? (
          <img
            src={flipbook.coverImage}
            alt={flipbook.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No cover</div>
        )}
        <span
          className={cn(
            "absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium",
            flipbook.status === "published"
              ? "bg-green-100 text-green-700"
              : "bg-slate-200 text-slate-600"
          )}
        >
          {flipbook.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate font-semibold text-slate-900">{flipbook.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span>{sourceLabels[flipbook.sourceType] || flipbook.sourceType}</span>
          <span>·</span>
          <span>{flipbook.pageCount} pages</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Created {formatDate(flipbook.createdAt)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          <Link href={`/viewer/${flipbook.id}`}>
            <Button variant="ghost" size="sm" aria-label="View">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={`/customize/${flipbook.id}`}>
            <Button variant="ghost" size="sm" aria-label="Customize">
              <Palette className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onShare(flipbook.id)} aria-label="Share">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Link href={`/analytics/${flipbook.id}`}>
            <Button variant="ghost" size="sm" aria-label="Analytics">
              <BarChart3 className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(flipbook.id)} aria-label="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(flipbook.id)} aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
