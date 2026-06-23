"use client";

import { BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/common/Button";
import { cn, getButtonRadius } from "@/lib/utils/cn";
import type { FlipbookEffect, FlipbookSettings } from "@/types/flipbook";

interface ViewModeSwitcherProps {
  effect: FlipbookEffect;
  onChange: (effect: FlipbookEffect) => void;
  settings: FlipbookSettings;
}

const modes: { id: FlipbookEffect; label: string; icon: React.ReactNode }[] = [
  { id: "flip", label: "Flip", icon: <BookOpen className="h-4 w-4" /> },
  { id: "slide", label: "Slide", icon: <Layers className="h-4 w-4" /> },
];

export function ViewModeSwitcher({ effect, onChange, settings }: ViewModeSwitcherProps) {
  const radius = getButtonRadius(settings.buttonStyle);
  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-colors",
            radius,
            effect === mode.id
              ? "bg-white text-brand-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
          aria-label={`${mode.label} view`}
          aria-pressed={effect === mode.id}
        >
          {mode.icon}
          <span className="hidden sm:inline">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
