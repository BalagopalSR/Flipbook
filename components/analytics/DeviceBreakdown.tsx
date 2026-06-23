"use client";

import { Card } from "@/components/common/Card";

interface DeviceBreakdownProps {
  data: { device: string; percent: number }[];
}

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  const colors = ["bg-blue-500", "bg-green-500", "bg-amber-500"];
  return (
    <Card>
      <h3 className="mb-4 font-semibold text-slate-900">Device breakdown</h3>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.device} className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
            <span className="flex-1 text-sm text-slate-600">{d.device}</span>
            <span className="text-sm font-medium text-slate-900">{d.percent}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
