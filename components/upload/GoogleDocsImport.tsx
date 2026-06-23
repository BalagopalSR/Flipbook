"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { importGoogleDocs } from "@/lib/converters/googleDocsConverter";
import { Info } from "lucide-react";

export function GoogleDocsImport() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const result = await importGoogleDocs(url);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-8 w-8 text-blue-500" />
        <div>
          <h3 className="font-semibold text-slate-900">Import from Google Docs</h3>
          <p className="text-sm text-slate-500">Paste a public Google Docs URL</p>
        </div>
      </div>
      <Input
        placeholder="https://docs.google.com/document/d/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="Google Docs URL"
      />
      <Button className="mt-4 w-full" onClick={handleImport} disabled={!url || loading}>
        {loading ? "Validating..." : "Import Document"}
      </Button>
      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </Card>
  );
}
