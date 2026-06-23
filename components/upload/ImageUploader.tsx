"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  GripVertical,
  RotateCcw,
  RotateCw,
  Star,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { validateImageFile } from "@/lib/utils/fileValidation";
import { FileValidationMessage } from "./FileValidationMessage";
import { FlipbookCreateOverlay, type FlipbookCreatePhase } from "./FlipbookCreateOverlay";
import {
  createImageUploadItem,
  convertImagesToPages,
  revokeImageItems,
  type ImageUploadItem,
} from "@/lib/converters/imageConverter";
import { createDefaultFlipbook, DEFAULT_SETTINGS } from "@/types/flipbook";
import type { PageSizeOption, ImageFitMode, ConversionProgress as ProgressType } from "@/types/flipbook";
import { generateId } from "@/lib/utils/generateId";
import { saveFlipbook } from "@/lib/storage/flipbookStorage";
import { goToViewer } from "@/lib/navigation/goToViewer";
import { RENDER_QUALITY_VERSION } from "@/lib/converters/renderQuality";

export function ImageUploader() {
  const [items, setItems] = useState<ImageUploadItem[]>([]);
  const [error, setError] = useState<string>();
  const [createPhase, setCreatePhase] = useState<FlipbookCreatePhase | null>(null);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [pageSize, setPageSize] = useState<PageSizeOption>("auto");
  const [fitMode, setFitMode] = useState<ImageFitMode>("fit");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: ImageUploadItem[] = [];
    for (const file of Array.from(files)) {
      const result = validateImageFile(file);
      if (!result.valid) {
        setError(result.error);
        return;
      }
      newItems.push(createImageUploadItem(file));
    }
    setError(undefined);
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const rotateItem = (id: string, direction: "left" | "right") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, rotation: item.rotation + (direction === "right" ? 90 : -90) }
          : item
      )
    );
  };

  const setCover = (id: string) => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, isCover: item.id === id }))
    );
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleConvert = async () => {
    if (items.length === 0) return;
    setCreatePhase("converting");
    try {
      const pages = await convertImagesToPages(items, pageSize, fitMode, setProgress);
      const flipbook = createDefaultFlipbook({
        id: generateId(),
        title: "Image Flipbook",
        sourceType: "images",
        pages,
        settings: { ...DEFAULT_SETTINGS, pageRenderVersion: RENDER_QUALITY_VERSION },
      });

      setCreatePhase("saving");
      setProgress(null);
      await saveFlipbook(flipbook);
      revokeImageItems(items);

      setCreatePhase("opening");
      goToViewer(flipbook.id);
    } catch (err) {
      setCreatePhase(null);
      setProgress(null);
      setError(err instanceof Error ? err.message : "Conversion failed");
    }
  };

  const isCreating = createPhase !== null;

  return (
    <>
      {createPhase && (
        <FlipbookCreateOverlay
          phase={createPhase}
          message={progress?.message}
          current={progress?.current}
          total={progress?.total}
        />
      )}

      <Card>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center"
      >
        <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
        <p className="mt-3 text-sm font-medium text-slate-700">
          Drag and drop images here
        </p>
        <p className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP — single or multiple</p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/*"
            multiple
            className="hidden"
            disabled={isCreating}
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <span className="cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Browse images
          </span>
        </label>
      </div>

      {items.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={() => setDragIndex(null)}
                className="group relative rounded-lg border border-slate-200 bg-slate-50 p-2"
              >
                <GripVertical className="absolute top-1 left-1 h-4 w-4 cursor-grab text-slate-400" />
                {item.isCover && (
                  <span className="absolute top-1 right-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    COVER
                  </span>
                )}
                <img
                  src={item.previewUrl}
                  alt={`Upload ${index + 1}`}
                  className="mx-auto h-24 w-full rounded object-contain"
                  style={{ transform: `rotate(${item.rotation}deg)` }}
                />
                <div className="mt-2 flex justify-center gap-1">
                  <button
                    onClick={() => rotateItem(item.id, "left")}
                    className="rounded p-1 hover:bg-slate-200"
                    aria-label="Rotate left"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => rotateItem(item.id, "right")}
                    className="rounded p-1 hover:bg-slate-200"
                    aria-label="Rotate right"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setCover(item.id)}
                    className="rounded p-1 hover:bg-slate-200"
                    aria-label="Set as cover"
                  >
                    <Star className={`h-3.5 w-3.5 ${item.isCover ? "fill-amber-500 text-amber-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded p-1 hover:bg-red-100"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Page size</label>
              <Select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
              >
                <option value="auto">Auto</option>
                <option value="a4-portrait">A4 Portrait</option>
                <option value="a4-landscape">A4 Landscape</option>
                <option value="square">Square</option>
                <option value="custom">Custom ratio (Phase 2)</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Image fit</label>
              <Select
                value={fitMode}
                onChange={(e) => setFitMode(e.target.value as ImageFitMode)}
              >
                <option value="fit">Fit (no crop)</option>
                <option value="fill">Fill (crop)</option>
              </Select>
            </div>
          </div>
        </>
      )}

      <FileValidationMessage error={error} />

      <Button
        className="mt-4 w-full"
        onClick={handleConvert}
        disabled={items.length === 0 || isCreating}
      >
        {isCreating ? "Creating..." : `Create Flipbook (${items.length} pages)`}
      </Button>
    </Card>
    </>
  );
}
