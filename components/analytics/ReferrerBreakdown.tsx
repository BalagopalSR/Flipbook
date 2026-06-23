"use client";

import { Card } from "@/components/common/Card";

interface ReferrerBreakdownProps {
  data: { source: string; percent: number }[];
}

export function ReferrerBreakdown({ data }: ReferrerBreakdownProps) {
  return (
    <Card>
      <h3 className="mb-4 font-semibold text-slate-900">Source / referrer</h3>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.source} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{d.source}</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${d.percent}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-900 w-10 text-right">
                {d.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
