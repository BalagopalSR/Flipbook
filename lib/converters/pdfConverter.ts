import type { FlipbookPage, ConversionProgress } from "@/types/flipbook";
import { generateId } from "@/lib/utils/generateId";
import {
  getPdfRenderScale,
  needsPageQualityUpgrade,
} from "@/lib/converters/renderQuality";
import {
  canvasToPageBlob,
  createThumbnailDataUrl,
  COVER_LONG_EDGE,
  SIDEBAR_THUMB_LONG_EDGE,
} from "@/lib/converters/imageEncoding";

type ProgressCallback = (progress: ConversionProgress) => void;

export { needsPageQualityUpgrade };

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

async function pdfSourceToArrayBuffer(source: File | ArrayBuffer | string): Promise<ArrayBuffer> {
  if (source instanceof File) return source.arrayBuffer();
  if (source instanceof ArrayBuffer) return source;
  const res = await fetch(source);
  return res.arrayBuffer();
}

async function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => resolve(), { timeout: 50 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

async function renderPdfToPages(
  source: File | ArrayBuffer | string,
  onProgress?: ProgressCallback,
  existingPages?: FlipbookPage[]
): Promise<FlipbookPage[]> {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await pdfSourceToArrayBuffer(source);

  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("password")) {
      throw new Error("This PDF is password-protected. Please remove the password and try again.");
    }
    throw new Error("Failed to read PDF. The file may be corrupted.");
  }

  const total = pdf.numPages;
  if (total > 200) {
    throw new Error("PDF has too many pages for browser rendering. Please use a smaller file.");
  }

  const pages: FlipbookPage[] = [];

  for (let i = 1; i <= total; i++) {
    onProgress?.({
      current: i,
      total,
      message: existingPages
        ? `Enhancing page ${i} of ${total}`
        : `Rendering page ${i} of ${total}`,
    });

    try {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const scale = getPdfRenderScale(viewport);
      const scaledViewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(scaledViewport.width);
      canvas.height = Math.floor(scaledViewport.height);
      const ctx = canvas.getContext("2d", { alpha: false })!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      await page.render({
        canvasContext: ctx,
        viewport: scaledViewport,
        intent: "print",
      }).promise;

      const blob = await canvasToPageBlob(canvas);
      const imageUrl = URL.createObjectURL(blob);
      const thumbMax = i === 1 ? COVER_LONG_EDGE : SIDEBAR_THUMB_LONG_EDGE;
      const thumbnailUrl = createThumbnailDataUrl(canvas, thumbMax);
      const existing = existingPages?.[i - 1];

      pages.push({
        id: existing?.id ?? generateId(),
        pageNumber: existing?.pageNumber ?? i,
        imageUrl,
        thumbnailUrl,
        width: canvas.width,
        height: canvas.height,
        sourceType: "pdf",
      });

      page.cleanup();
    } catch {
      throw new Error(`Failed to render page ${i}.`);
    }

    await yieldToMain();
  }

  return pages;
}

export async function convertPdfToPages(
  file: File,
  onProgress?: ProgressCallback
): Promise<{ pages: FlipbookPage[]; originalFileUrl: string }> {
  const originalFileUrl = URL.createObjectURL(file);
  const pages = await renderPdfToPages(file, onProgress);
  return { pages, originalFileUrl };
}

export async function upgradePdfFlipbookPages(
  originalFileUrl: string,
  existingPages: FlipbookPage[],
  onProgress?: ProgressCallback
): Promise<FlipbookPage[]> {
  return renderPdfToPages(originalFileUrl, onProgress, existingPages);
}

export function revokePageUrls(pages: FlipbookPage[]): void {
  pages.forEach((p) => {
    if (p.imageUrl.startsWith("blob:")) URL.revokeObjectURL(p.imageUrl);
  });
}
