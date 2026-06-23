import type { Flipbook } from "@/types/flipbook";
import { DashboardFlipbookCard } from "./DashboardFlipbookCard";

interface FlipbookGridProps {
  flipbooks: Flipbook[];
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onShare: (id: string) => void;
}

export function FlipbookGrid({ flipbooks, onDelete, onDuplicate, onShare }: FlipbookGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {flipbooks.map((fb) => (
        <DashboardFlipbookCard
          key={fb.id}
          flipbook={fb}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
