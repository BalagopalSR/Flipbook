"use client";

import { Card } from "@/components/common/Card";

interface ViewsChartProps {
  data: { date: string; views: number }[];
}

export function ViewsChart({ data }: ViewsChartProps) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <Card>
      <h3 className="mb-4 font-semibold text-slate-900">Views over time</h3>
      <div className="flex h-48 items-end gap-2">
        {data.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-brand-500 transition-all"
              style={{ height: `${(d.views / max) * 100}%`, minHeight: 4 }}
              title={`${d.views} views`}
            />
            <span className="text-xs text-slate-500">{d.date}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
