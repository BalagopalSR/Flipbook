"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AnalyticsCards } from "@/components/analytics/AnalyticsCards";
import { ViewsChart } from "@/components/analytics/ViewsChart";
import { PageViewsChart } from "@/components/analytics/PageViewsChart";
import { DeviceBreakdown } from "@/components/analytics/DeviceBreakdown";
import { ReferrerBreakdown } from "@/components/analytics/ReferrerBreakdown";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/common/Button";
import { getFlipbook } from "@/lib/storage/flipbookStorage";
import { getMockAnalyticsData } from "@/lib/analytics/analyticsTracker";
import type { Flipbook } from "@/types/flipbook";

export default function AnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  const [flipbook, setFlipbook] = useState<Flipbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getFlipbook(id).then((fb) => {
      if (!fb) setError("Flipbook not found");
      else setFlipbook(fb);
      setLoading(false);
    });
  }, [id]);

  const mockData = getMockAnalyticsData(id);

  if (loading) {
    return (
      <AppShell>
        <LoadingState message="Loading analytics..." />
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
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Analytics: {flipbook.title}</h1>
          <p className="text-sm text-slate-500">Mock data for MVP — real tracking in Phase 2</p>
        </div>
      </div>
      <div className="space-y-6 p-6">
        <AnalyticsCards
          analytics={flipbook.analytics}
          mockData={{ totalReads: 634, mostViewedPage: "Page 1" }}
        />
        <ViewsChart data={mockData.viewsOverTime} />
        <div className="grid gap-6 lg:grid-cols-2">
          <PageViewsChart data={mockData.pageViews} />
          <DeviceBreakdown data={mockData.devices} />
        </div>
        <ReferrerBreakdown data={mockData.referrers} />
      </div>
    </AppShell>
  );
}
