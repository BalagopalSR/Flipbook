"use client";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { UploadTabs } from "@/components/upload/UploadTabs";
import { ImportFlipbook } from "@/components/upload/ImportFlipbook";

export default function UploadPage() {
  return (
    <AppShell>
      <TopBar title="Create Flipbook" subtitle="Upload or import your content" />
      <div className="p-6">
        <PageHeader
          title="Upload & Import"
          description="Choose a source type and convert your content into an interactive flipbook."
        />
        <div className="mx-auto max-w-2xl">
          <UploadTabs />
          <ImportFlipbook />
        </div>
      </div>
    </AppShell>
  );
}
