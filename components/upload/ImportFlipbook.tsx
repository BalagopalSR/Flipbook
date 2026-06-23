"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Card } from "@/components/common/Card";
import { FlipbookCreateOverlay, type FlipbookCreatePhase } from "./FlipbookCreateOverlay";
import { importFlipbookFromFile } from "@/lib/storage/flipbookExport";
import { goToViewer } from "@/lib/navigation/goToViewer";

export function ImportFlipbook() {
  const [importPhase, setImportPhase] = useState<FlipbookCreatePhase | null>(null);
  const [error, setError] = useState<string>();

  const handleImport = async (file: File) => {
    setImportPhase("saving");
    setError(undefined);
    try {
      const flipbook = await importFlipbookFromFile(file);
      setImportPhase("opening");
      goToViewer(flipbook.id);
    } catch (err) {
      setImportPhase(null);
      setError(err instanceof Error ? err.message : "Import failed");
    }
  };

  return (
    <>
      {importPhase && (
        <FlipbookCreateOverlay
          phase={importPhase}
          message={importPhase === "saving" ? "Importing flipbook..." : undefined}
        />
      )}

      <Card className="mt-6">
        <div className="mb-3 flex items-center gap-3">
          <FileDown className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-slate-900">Import Shared Flipbook</h3>
            <p className="text-sm text-slate-500">
              Received a .flipbook.json file from someone? Import it here.
            </p>
          </div>
        </div>
        <label className="inline-block cursor-pointer">
          <input
            type="file"
            accept=".json,.flipbook.json"
            className="hidden"
            disabled={importPhase !== null}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
            }}
          />
          <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {importPhase ? "Importing..." : "Import flipbook file"}
          </span>
        </label>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>
    </>
  );
}
