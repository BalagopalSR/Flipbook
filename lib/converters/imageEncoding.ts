/** Long edge for dashboard / history cover images. */
export const COVER_LONG_EDGE = 800;

/** Long edge for sidebar page thumbnails. */
export const SIDEBAR_THUMB_LONG_EDGE = 400;

const MAX_PAGE_PNG_BYTES = 5 * 1024 * 1024;

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function drawToCanvas(
  source: CanvasImageSource,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false })!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

export function scaleCanvasToLongEdge(
  source: HTMLCanvasElement,
  maxLongEdge: number
): HTMLCanvasElement {
  const longEdge = Math.max(source.width, source.height);
  const scale = Math.min(maxLongEdge / longEdge, 1);
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);
  return drawToCanvas(source, width, height);
}

async function canvasToBlobWithType(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  quality = 0.95
): string {
  const formats: Array<{ type: string; q?: number }> = [
    { type: "image/png" },
    { type: "image/webp", q: quality },
    { type: "image/jpeg", q: Math.min(quality + 0.02, 1) },
  ];

  for (const { type, q } of formats) {
    const url = canvas.toDataURL(type, q);
    if (url && url !== "data:,") return url;
  }

  return canvas.toDataURL("image/png");
}

/** Lossless PNG preferred for sharp text; falls back to WebP for large pages. */
export async function canvasToPageBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const png = await canvasToBlobWithType(canvas, "image/png");
  if (png && png.size <= MAX_PAGE_PNG_BYTES) return png;

  const formats: Array<{ type: string; quality?: number }> = [
    { type: "image/webp", quality: 0.99 },
    { type: "image/jpeg", quality: 0.99 },
  ];

  for (const { type, quality } of formats) {
    const blob = await canvasToBlobWithType(canvas, type, quality);
    if (blob) return blob;
  }

  if (png) return png;
  throw new Error("Failed to create image blob");
}

export function createThumbnailDataUrl(
  canvas: HTMLCanvasElement,
  maxLongEdge: number
): string {
  return canvasToDataUrl(scaleCanvasToLongEdge(canvas, maxLongEdge), 0.95);
}

export async function resizeDataUrl(
  dataUrl: string,
  maxLongEdge: number
): Promise<string> {
  const img = await loadImageElement(dataUrl);
  const longEdge = Math.max(img.width, img.height);
  const scale = Math.min(maxLongEdge / longEdge, 1);
  const canvas = drawToCanvas(
    img,
    Math.round(img.width * scale),
    Math.round(img.height * scale)
  );
  return canvasToDataUrl(canvas, 0.95);
}
