"use client";

import { useState } from "react";
import { Presentation } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { importGoogleSlides } from "@/lib/converters/googleSlidesConverter";
import { Info } from "lucide-react";

export function GoogleSlidesImport() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const result = await importGoogleSlides(url);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Presentation className="h-8 w-8 text-yellow-500" />
        <div>
          <h3 className="font-semibold text-slate-900">Import from Google Slides</h3>
          <p className="text-sm text-slate-500">Paste a public Google Slides URL</p>
        </div>
      </div>
      <Input
        placeholder="https://docs.google.com/presentation/d/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="Google Slides URL"
      />
      <Button className="mt-4 w-full" onClick={handleImport} disabled={!url || loading}>
        {loading ? "Validating..." : "Import Presentation"}
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
