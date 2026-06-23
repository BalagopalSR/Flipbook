"use client";

import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { CopyButton } from "@/components/common/CopyButton";
import { Button } from "@/components/common/Button";
import { QRCodeBox } from "./QRCodeBox";
import { EmbedCodeBox, getEmbedCode, getShareUrl } from "./EmbedCodeBox";
import { Info, Download } from "lucide-react";
import { trackShare } from "@/lib/analytics/analyticsTracker";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  flipbookId: string;
  title?: string;
  onExport?: () => void;
}

export function ShareModal({ open, onClose, flipbookId, onExport }: ShareModalProps) {
  const shareUrl = getShareUrl(flipbookId);
  const embedCode = getEmbedCode(flipbookId);

  const handleCopyLink = () => trackShare(flipbookId, "copy-link");

  return (
    <Modal open={open} onClose={onClose} title="Share Flipbook" size="lg">
      <div className="space-y-6">
        {/* Share with others - primary method */}
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-brand-900">
            <Download className="h-4 w-4" />
            Share with others (recommended)
          </h3>
          <p className="mt-2 text-sm text-brand-800">
            Flipbooks are interactive web experiences, not PDF files. To share with someone on
            another device, export the flipbook package and send them the file. They can import
            it on the Upload page.
          </p>
          {onExport && (
            <Button className="mt-3" onClick={onExport}>
              <Download className="h-4 w-4" />
              Export flipbook package
            </Button>
          )}
        </div>

        {/* Same-device link */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            View link (same browser only)
          </label>
          <div className="mb-2 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              This link works on your computer in the same browser where you created the flipbook.
              Others cannot open it until you deploy to a server (Phase 2) or export the file above.
            </span>
          </div>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly aria-label="Share link" />
            <div onClick={handleCopyLink}>
              <CopyButton text={shareUrl} label="Copy" />
            </div>
          </div>
        </div>

        <EmbedCodeBox flipbookId={flipbookId} />
        <div className="flex justify-end">
          <CopyButton text={embedCode} label="Copy embed" />
        </div>

        <QRCodeBox url={shareUrl} />
      </div>
    </Modal>
  );
}
