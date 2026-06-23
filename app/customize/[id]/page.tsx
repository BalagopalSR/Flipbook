"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CustomizePanel } from "@/components/customize/CustomizePanel";
import { LivePreview } from "@/components/customize/LivePreview";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/common/Button";
import { getFlipbook, saveFlipbook } from "@/lib/storage/flipbookStorage";
import type { Flipbook, FlipbookSettings } from "@/types/flipbook";
import { useToast } from "@/components/common/Toast";

export default function CustomizePage() {
  const params = useParams();
  const id = params.id as string;
  const [flipbook, setFlipbook] = useState<Flipbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getFlipbook(id).then((fb) => {
      if (!fb) setError("Flipbook not found");
      else setFlipbook(fb);
      setLoading(false);
    });
  }, [id]);

  const handleChange = useCallback(
    (updates: { title?: string; description?: string; settings?: Partial<FlipbookSettings> }) => {
      setFlipbook((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...updates,
          settings: updates.settings ? { ...prev.settings, ...updates.settings } : prev.settings,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  const handleSave = async () => {
    if (!flipbook) return;
    if (
      flipbook.settings.passwordProtection &&
      !flipbook.settings.hasAccessPassword &&
      !flipbook.settings.accessPassword
    ) {
      showToast("Set a password before enabling password protection", "error");
      return;
    }
    setSaving(true);
    await saveFlipbook(flipbook);
    setSaving(false);
    showToast("Settings saved!", "success");
  };

  if (loading) {
    return (
      <AppShell>
        <LoadingState message="Loading..." />
      </AppShell>
    );
  }

  if (error || !flipbook) {
    return (
      <AppShell>
        <ErrorState message={error || "Flipbook not found"} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/viewer/${id}`}>
            <Button variant="ghost" size="sm" aria-label="Back to viewer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Customize: {flipbook.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_380px]">
        <LivePreview flipbook={flipbook} />
        <CustomizePanel flipbook={flipbook} onChange={handleChange} />
      </div>
    </AppShell>
  );
}
