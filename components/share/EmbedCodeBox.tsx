interface EmbedCodeBoxProps {
  flipbookId: string;
}

export function EmbedCodeBox({ flipbookId }: EmbedCodeBoxProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  const embedCode = `<iframe 
  src="${origin}/viewer/${flipbookId}" 
  width="100%" 
  height="600" 
  style="border:none;" 
  allowfullscreen>
</iframe>`;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">Embed code</label>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-green-400">
        {embedCode}
      </pre>
    </div>
  );
}

export function getEmbedCode(flipbookId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  return `<iframe src="${origin}/viewer/${flipbookId}" width="100%" height="600" style="border:none;" allowfullscreen></iframe>`;
}

export function getShareUrl(flipbookId: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com";
  return `${origin}/viewer/${flipbookId}`;
}
