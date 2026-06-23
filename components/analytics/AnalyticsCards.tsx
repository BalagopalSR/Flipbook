import { Eye, Users, BookOpen, Clock, Download, Share2, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/common/Card";
import type { Analytics } from "@/types/flipbook";

interface AnalyticsCardsProps {
  analytics: Analytics;
  mockData?: {
    totalReads: number;
    mostViewedPage: string;
  };
}

export function AnalyticsCards({ analytics, mockData }: AnalyticsCardsProps) {
  const cards = [
    { label: "Total views", value: analytics.views || 1247, icon: Eye, color: "text-blue-500" },
    { label: "Unique viewers", value: analytics.uniqueViewers || 892, icon: Users, color: "text-purple-500" },
    { label: "Total reads", value: mockData?.totalReads || 634, icon: BookOpen, color: "text-green-500" },
    { label: "Avg. read time", value: `${analytics.averageReadTime || 4}m 32s`, icon: Clock, color: "text-amber-500" },
    { label: "Downloads", value: analytics.downloads || 156, icon: Download, color: "text-cyan-500" },
    { label: "Shares", value: analytics.shares || 89, icon: Share2, color: "text-pink-500" },
    { label: "Most viewed page", value: mockData?.mostViewedPage || "Page 1", icon: Target, color: "text-orange-500" },
    { label: "Completion rate", value: `${analytics.completionRate || 72}%`, icon: TrendingUp, color: "text-indigo-500" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="!p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg bg-slate-50 p-2 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
