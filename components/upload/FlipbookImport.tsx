"use client";

import { useState } from "react";
import { Upload, Info } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { importFlipbookFromFile } from "@/lib/storage/flipbookExport";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/Toast";
import { ConversionProgress } from "./ConversionProgress";

export function FlipbookImport() {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { showToast } = useToast();

  const handleImport = async (file: File) => {
    setImporting(true);
    setError(undefined);
    try {
      const flipbook = await importFlipbookFromFile(file);
      showToast("Flipbook imported successfully!", "success");
      router.push(`/viewer/${flipbook.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Upload className="h-8 w-8 text-green-500" />
        <div>
          <h3 className="font-semibold text-slate-900">Import Shared Flipbook</h3>
          <p className="text-sm text-slate-500">
            Open a .flipbook.json file shared by someone else
          </p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
        <p className="text-sm text-slate-600">Drop a .flipbook.json file here</p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            accept=".json,.flipbook.json,application/json"
            className="hidden"
            disabled={importing}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
            }}
          />
          <span className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Browse file
          </span>
        </label>
      </div>
      {importing && (
        <ConversionProgress current={1} total={1} message="Importing flipbook..." />
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          To share a flipbook with others, use the Share button in the viewer to copy a link
          (same device) or export a .flipbook.json file they can import here.
        </p>
      </div>
    </Card>
  );
}
