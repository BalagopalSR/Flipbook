"use client";

import { BrandingSettings } from "./BrandingSettings";
import { EffectSettings } from "./EffectSettings";
import { ToolbarSettings } from "./ToolbarSettings";
import { AccessSettings } from "./AccessSettings";
import type { Flipbook, FlipbookSettings } from "@/types/flipbook";
import { MousePointer } from "lucide-react";

interface CustomizePanelProps {
  flipbook: Flipbook;
  onChange: (updates: { title?: string; description?: string; settings?: Partial<FlipbookSettings> }) => void;
}

export function CustomizePanel({ flipbook, onChange }: CustomizePanelProps) {
  const handleSettingsChange = (updates: Partial<FlipbookSettings>) => {
    onChange({ settings: { ...flipbook.settings, ...updates } });
  };

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Customize</h2>
      <div className="space-y-8">
        <BrandingSettings flipbook={flipbook} onChange={onChange} />
        <hr />
        <EffectSettings settings={flipbook.settings} onChange={handleSettingsChange} />
        <hr />
        <ToolbarSettings settings={flipbook.settings} onChange={handleSettingsChange} />
        <hr />
        <AccessSettings settings={flipbook.settings} onChange={handleSettingsChange} />
        <hr />
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <MousePointer className="h-4 w-4" />
            Interactive Elements
          </h3>
          <p className="text-sm text-slate-500">
            Phase 2: Add clickable links, video hotspots, CTAs, forms, bookmarks, and more.
          </p>
          {/* Phase 2: FlipbookHotspot editor UI */}
        </div>
      </div>
    </div>
  );
}
