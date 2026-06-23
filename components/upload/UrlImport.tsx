"use client";

import { useState } from "react";
import { Link2, Info } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { importFromUrl } from "@/lib/converters/urlConverter";

export function UrlImport() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const result = await importFromUrl(url);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Link2 className="h-8 w-8 text-purple-500" />
        <div>
          <h3 className="font-semibold text-slate-900">Import from URL</h3>
          <p className="text-sm text-slate-500">Paste a public PDF or image URL</p>
        </div>
      </div>
      <Input
        placeholder="https://example.com/document.pdf"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="File URL"
      />
      <Button className="mt-4 w-full" onClick={handleImport} disabled={!url || loading}>
        {loading ? "Validating..." : "Import from URL"}
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
