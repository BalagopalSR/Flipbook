"use client";

import { useState } from "react";
import { FileSpreadsheet, Info } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { validatePptFile } from "@/lib/utils/fileValidation";
import { formatFileSize } from "@/lib/utils/formatFileSize";
import { importPpt } from "@/lib/converters/pptConverter";
import { FileValidationMessage } from "./FileValidationMessage";

export function PptImportPlaceholder() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = (f: File) => {
    const result = validatePptFile(f);
    setError(result.error);
    if (result.valid) setFile(f);
  };

  const handleImport = async () => {
    if (!file) return;
    const result = await importPpt(file);
    setMessage(result.message);
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <FileSpreadsheet className="h-8 w-8 text-orange-500" />
        <div>
          <h3 className="font-semibold text-slate-900">PowerPoint Import</h3>
          <p className="text-sm text-slate-500">PPT / PPTX — Phase 2 feature</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
        <p className="text-sm text-slate-600">Select a PowerPoint file</p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            accept=".ppt,.pptx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <span className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Browse PPT/PPTX
          </span>
        </label>
      </div>
      {file && (
        <p className="mt-3 text-sm text-slate-600">
          {file.name} — {formatFileSize(file.size)}
        </p>
      )}
      <FileValidationMessage error={error} />
      <Button className="mt-4 w-full" onClick={handleImport} disabled={!file} variant="outline">
        Convert to Flipbook (Phase 2)
      </Button>
      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </Card>
  );
}
