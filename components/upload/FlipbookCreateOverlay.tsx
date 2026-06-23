"use client";

import { Loader2 } from "lucide-react";

export type FlipbookCreatePhase = "converting" | "saving" | "opening";

interface FlipbookCreateOverlayProps {
  phase: FlipbookCreatePhase;
  message?: string;
  current?: number;
  total?: number;
}

const defaultMessages: Record<FlipbookCreatePhase, string> = {
  converting: "Converting your content...",
  saving: "Saving flipbook...",
  opening: "Opening preview...",
};

export function FlipbookCreateOverlay({
  phase,
  message,
  current = 0,
  total = 0,
}: FlipbookCreateOverlayProps) {
  const showProgress = phase === "converting" && total > 0;
  const percent = showProgress ? Math.round((current / total) * 100) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flipbook-create-title"
      aria-describedby="flipbook-create-description"
    >
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" aria-hidden="true" />
          <div>
            <h2 id="flipbook-create-title" className="text-base font-semibold text-slate-900">
              Creating your flipbook
            </h2>
            <p id="flipbook-create-description" className="mt-1 text-sm text-slate-500">
              {message || defaultMessages[phase]}
            </p>
          </div>
          {showProgress && (
            <div className="w-full space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                Page {current} of {total} · {percent}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
