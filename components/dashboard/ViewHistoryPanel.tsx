"use client";

import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  getViewHistory,
  clearViewHistory,
  pruneViewHistory,
  type ViewHistoryEntry,
} from "@/lib/storage/viewHistory";
import { useCallback, useEffect, useState } from "react";

interface ViewHistoryPanelProps {
  flipbookIds: string[];
}

export function ViewHistoryPanel({ flipbookIds }: ViewHistoryPanelProps) {
  const [history, setHistory] = useState<ViewHistoryEntry[]>([]);

  const refresh = useCallback(() => {
    pruneViewHistory(flipbookIds);
    const valid = new Set(flipbookIds);
    setHistory(getViewHistory().filter((entry) => valid.has(entry.flipbookId)));
  }, [flipbookIds]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (history.length === 0) return null;

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="mb-4 !p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-900">Recent History</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearViewHistory();
            refresh();
          }}
          aria-label="Clear history"
          className="h-7 px-2 text-xs"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-0.5">
        {history.map((entry) => (
          <Link
            key={`${entry.flipbookId}-${entry.viewedAt}`}
            href={`/viewer/${entry.flipbookId}`}
            className="flex shrink-0 flex-col items-center gap-0.5 rounded-md border border-slate-200 p-1 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            {entry.coverImage ? (
              <img
                src={entry.coverImage}
                alt={entry.title}
                className="h-7 w-5 rounded object-cover"
              />
            ) : (
              <div className="flex h-7 w-5 items-center justify-center rounded bg-slate-100 text-[8px] text-slate-400">
                —
              </div>
            )}
            <span className="max-w-[2.5rem] truncate text-[9px] font-medium text-slate-700">
              {entry.title}
            </span>
            <span className="text-[8px] text-slate-400">{formatTime(entry.viewedAt)}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
