import type {
  FlipbookPage,
  PageSizeOption,
  ImageFitMode,
  ConversionProgress,
} from "@/types/flipbook";
import { generateId } from "@/lib/utils/generateId";
import { getPdfRenderScale } from "@/lib/converters/renderQuality";
import {
  canvasToPageBlob,
  createThumbnailDataUrl,
  COVER_LONG_EDGE,
  SIDEBAR_THUMB_LONG_EDGE,
  loadImageElement,
} from "@/lib/converters/imageEncoding";

export interface ImageUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number;
  isCover: boolean;
}

type ProgressCallback = (progress: ConversionProgress) => void;

const PAGE_SIZES: Record<Exclude<PageSizeOption, "auto" | "custom">, { width: number; height: number }> = {
  "a4-portrait": { width: 794, height: 1123 },
  "a4-landscape": { width: 1123, height: 794 },
  square: { width: 1000, height: 1000 },
};

function getPageDimensions(
  option: PageSizeOption,
  imgW: number,
  imgH: number
): { width: number; height: number } {
  if (option === "auto") return { width: imgW, height: imgH };
  if (option === "custom") return { width: imgW, height: imgH };
  return PAGE_SIZES[option];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return loadImageElement(src);
}

function upscaleDimensions(width: number, height: number): { width: number; height: number } {
  const targetScale = getPdfRenderScale({ width, height });
  if (targetScale <= 1) return { width, height };
  return {
    width: Math.round(width * targetScale),
    height: Math.round(height * targetScale),
  };
}

export async function convertImagesToPages(
  items: ImageUploadItem[],
  pageSize: PageSizeOption = "auto",
  fitMode: ImageFitMode = "fit",
  onProgress?: ProgressCallback
): Promise<FlipbookPage[]> {
  const sorted = [...items].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    return 0;
  });

  const total = sorted.length;
  const pages: FlipbookPage[] = [];

  for (let i = 0; i < total; i++) {
    const item = sorted[i];
    onProgress?.({
      current: i + 1,
      total,
      message: `Processing image ${i + 1} of ${total}`,
    });

    const img = await loadImage(item.previewUrl);
    const baseDims = getPageDimensions(pageSize, img.width, img.height);
    const dims =
      pageSize === "auto" || pageSize === "custom"
        ? upscaleDimensions(baseDims.width, baseDims.height)
        : baseDims;

    const canvas = document.createElement("canvas");
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, dims.width, dims.height);

    ctx.save();
    ctx.translate(dims.width / 2, dims.height / 2);
    ctx.rotate((item.rotation * Math.PI) / 180);

    const rotW = item.rotation % 180 !== 0 ? img.height : img.width;
    const rotH = item.rotation % 180 !== 0 ? img.width : img.height;

    let drawW = rotW;
    let drawH = rotH;

    if (fitMode === "fit") {
      const scale = Math.min(dims.width / rotW, dims.height / rotH);
      drawW = rotW * scale;
      drawH = rotH * scale;
    } else {
      const scale = Math.max(dims.width / rotW, dims.height / rotH);
      drawW = rotW * scale;
      drawH = rotH * scale;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const blob = await canvasToPageBlob(canvas);

    const imageUrl = URL.createObjectURL(blob);
    const thumbMax = i === 0 ? COVER_LONG_EDGE : SIDEBAR_THUMB_LONG_EDGE;
    const thumbnailUrl = createThumbnailDataUrl(canvas, thumbMax);

    pages.push({
      id: generateId(),
      pageNumber: i + 1,
      imageUrl,
      thumbnailUrl,
      width: dims.width,
      height: dims.height,
      sourceType: "images",
      rotation: item.rotation,
      isCover: item.isCover,
    });
  }

  return pages;
}

export function createImageUploadItem(file: File): ImageUploadItem {
  return {
    id: generateId(),
    file,
    previewUrl: URL.createObjectURL(file),
    rotation: 0,
    isCover: false,
  };
}

export function revokeImageItems(items: ImageUploadItem[]): void {
  items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
}
