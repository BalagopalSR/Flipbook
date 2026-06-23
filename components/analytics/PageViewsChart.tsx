"use client";

import { Card } from "@/components/common/Card";

interface PageViewsChartProps {
  data: { page: string; views: number }[];
}

export function PageViewsChart({ data }: PageViewsChartProps) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <Card>
      <h3 className="mb-4 font-semibold text-slate-900">Page-by-page views</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.page}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-slate-600">{d.page}</span>
              <span className="font-medium text-slate-900">{d.views}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${(d.views / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
