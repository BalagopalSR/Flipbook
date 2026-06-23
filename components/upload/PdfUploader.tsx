"use client";

import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { validatePdfFile } from "@/lib/utils/fileValidation";
import { formatFileSize } from "@/lib/utils/formatFileSize";
import { FileValidationMessage } from "./FileValidationMessage";
import { FlipbookCreateOverlay, type FlipbookCreatePhase } from "./FlipbookCreateOverlay";
import { convertPdfToPages } from "@/lib/converters/pdfConverter";
import { createDefaultFlipbook, DEFAULT_SETTINGS } from "@/types/flipbook";
import { generateId } from "@/lib/utils/generateId";
import { saveFlipbook } from "@/lib/storage/flipbookStorage";
import { goToViewer } from "@/lib/navigation/goToViewer";
import type { ConversionProgress as ProgressType } from "@/types/flipbook";
import { RENDER_QUALITY_VERSION } from "@/lib/converters/renderQuality";

export function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [warning, setWarning] = useState<string>();
  const [createPhase, setCreatePhase] = useState<FlipbookCreatePhase | null>(null);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    const result = validatePdfFile(f);
    setError(result.error);
    setWarning(result.warning);
    if (result.valid) setFile(f);
    else setFile(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleConvert = async () => {
    if (!file) return;
    setError(undefined);
    setCreatePhase("converting");
    try {
      const { pages, originalFileUrl } = await convertPdfToPages(file, setProgress);
      const title = file.name.replace(/\.pdf$/i, "");
      const flipbook = createDefaultFlipbook({
        id: generateId(),
        title,
        sourceType: "pdf",
        originalFileName: file.name,
        originalFileUrl,
        pages,
        settings: { ...DEFAULT_SETTINGS, pageRenderVersion: RENDER_QUALITY_VERSION },
      });

      setCreatePhase("saving");
      setProgress(null);
      await saveFlipbook(flipbook);

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
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? "border-brand-500 bg-brand-50" : "border-slate-300"
          }`}
        >
          <Upload className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            Drag and drop your PDF here
          </p>
          <p className="mt-1 text-xs text-slate-400">Supports .pdf files up to 50MB</p>
          <label className="mt-4 inline-block">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              disabled={isCreating}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <span className="cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Browse files
            </span>
          </label>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <FileText className="h-8 w-8 text-red-500" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
        )}

        <FileValidationMessage error={error} warning={warning} />

        <Button
          className="mt-4 w-full"
          onClick={handleConvert}
          disabled={!file || !!error || isCreating}
        >
          {isCreating ? "Creating..." : "Create Flipbook"}
        </Button>
      </Card>
    </>
  );
}
