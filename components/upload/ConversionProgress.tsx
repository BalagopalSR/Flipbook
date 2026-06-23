import { Loader2 } from "lucide-react";

interface ConversionProgressProps {
  current: number;
  total: number;
  message: string;
}

export function ConversionProgress({ current, total, message }: ConversionProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="mt-4 space-y-2" role="status">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>{message}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{percent}% complete</p>
    </div>
  );
}
