"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { filterFlipbooks } from "@/components/dashboard/DashboardFilters";
import { FlipbookGrid } from "@/components/dashboard/FlipbookGrid";
import { DeleteConfirmModal } from "@/components/dashboard/DeleteConfirmModal";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ShareModal } from "@/components/share/ShareModal";
import { getAllFlipbooks, deleteFlipbook, duplicateFlipbook } from "@/lib/storage/flipbookStorage";
import { exportFlipbookToFile } from "@/lib/storage/flipbookExport";
import type { Flipbook } from "@/types/flipbook";
import { useToast } from "@/components/common/Toast";
import { ViewHistoryPanel } from "@/components/dashboard/ViewHistoryPanel";
import { BookOpen } from "lucide-react";

export default function DashboardPage() {
  const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Flipbook | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllFlipbooks();
    setFlipbooks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = filterFlipbooks(flipbooks, search);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteFlipbook(deleteTarget.id);
    setDeleteTarget(null);
    showToast("Flipbook deleted", "success");
    load();
  };

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateFlipbook(id);
    if (dup) {
      showToast("Flipbook duplicated", "success");
      load();
    }
  };

  const handleExport = async (flipbook: Flipbook) => {
    try {
      await exportFlipbookToFile(flipbook);
      showToast("Flipbook exported! Send this file to others to share.", "success");
    } catch {
      showToast("Export failed. Please try again.", "error");
    }
  };

  const shareFlipbook = flipbooks.find((f) => f.id === shareId);

  return (
    <AppShell>
      <TopBar
        title="Dashboard"
        action={{ label: "Create Flipbook", href: "/upload" }}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search flipbooks...",
        }}
      />
      <div className="p-6">
        <ViewHistoryPanel flipbookIds={flipbooks.map((f) => f.id)} />
        {loading ? (
          <LoadingState message="Loading flipbooks..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No flipbooks yet"
            description="Create your first flipbook by uploading a PDF or images."
            actionLabel="Create Flipbook"
            actionHref="/upload"
            icon={<BookOpen className="h-8 w-8 text-slate-400" />}
          />
        ) : (
          <FlipbookGrid
            flipbooks={filtered}
            onDelete={(id) => setDeleteTarget(flipbooks.find((f) => f.id === id) || null)}
            onDuplicate={handleDuplicate}
            onShare={setShareId}
          />
        )}
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        title={deleteTarget?.title || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {shareFlipbook && (
        <ShareModal
          open={!!shareId}
          onClose={() => setShareId(null)}
          flipbookId={shareFlipbook.id}
          title={shareFlipbook.title}
          onExport={() => handleExport(shareFlipbook)}
        />
      )}
    </AppShell>
  );
}
