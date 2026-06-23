"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Palette } from "lucide-react";
import { FlipbookViewer } from "@/components/viewer/FlipbookViewer";
import { ViewerAccessGate } from "@/components/viewer/ViewerAccessGate";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/common/Button";
import { ConversionProgress } from "@/components/upload/ConversionProgress";
import { getFlipbook, saveFlipbook } from "@/lib/storage/flipbookStorage";
import { addToViewHistory } from "@/lib/storage/viewHistory";
import {
  needsPageQualityUpgrade,
  upgradePdfFlipbookPages,
} from "@/lib/converters/pdfConverter";
import { RENDER_QUALITY_VERSION } from "@/lib/converters/renderQuality";
import type { Flipbook, ConversionProgress as ProgressType } from "@/types/flipbook";

export default function ViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [flipbook, setFlipbook] = useState<Flipbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceProgress, setEnhanceProgress] = useState<ProgressType | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(undefined);

      const fb = await getFlipbook(id);
      if (cancelled) return;

      if (!fb) {
        setError("Flipbook not found");
        setFlipbook(null);
        setLoading(false);
        return;
      }

      setFlipbook(fb);
      setLoading(false);

      addToViewHistory({
        flipbookId: fb.id,
        title: fb.title,
        coverImage: fb.coverImage,
      });

      const shouldEnhance =
        fb.sourceType === "pdf" &&
        !!fb.originalFileUrl &&
        needsPageQualityUpgrade(fb.pages, fb.settings.pageRenderVersion);

      if (!shouldEnhance) return;

      setEnhancing(true);
      try {
        const pages = await upgradePdfFlipbookPages(
          fb.originalFileUrl!,
          fb.pages,
          (progress) => {
            if (!cancelled) setEnhanceProgress(progress);
          }
        );

        if (cancelled) return;

        const upgraded: Flipbook = {
          ...fb,
          pages,
          pageCount: pages.length,
          coverImage: pages[0]?.thumbnailUrl || pages[0]?.imageUrl,
          settings: { ...fb.settings, pageRenderVersion: RENDER_QUALITY_VERSION },
          updatedAt: new Date().toISOString(),
        };

        setFlipbook(upgraded);

        try {
          await saveFlipbook(upgraded);
        } catch {
          // Upgraded pages remain visible for this session.
        }
      } catch {
        // Keep showing the originally loaded pages.
      } finally {
        if (!cancelled) {
          setEnhancing(false);
          setEnhanceProgress(null);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" aria-label="Back to dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="truncate text-sm font-semibold text-slate-900">
            {flipbook?.title || "Flipbook Viewer"}
          </h1>
        </div>
        {flipbook && (
          <Link href={`/customize/${flipbook.id}`}>
            <Button variant="outline" size="sm">
              <Palette className="h-4 w-4" />
              Customize
            </Button>
          </Link>
        )}
      </header>
      <div className="relative flex-1 overflow-hidden">
        {loading ? (
          <LoadingState message="Loading flipbook..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : flipbook ? (
          <>
            <ViewerAccessGate flipbook={flipbook}>
              <FlipbookViewer flipbook={flipbook} />
            </ViewerAccessGate>
            {enhancing && enhanceProgress && (
              <div className="absolute inset-x-0 bottom-20 z-40 mx-auto max-w-md px-4">
                <ConversionProgress
                  current={enhanceProgress.current}
                  total={enhanceProgress.total}
                  message={enhanceProgress.message}
                />
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
