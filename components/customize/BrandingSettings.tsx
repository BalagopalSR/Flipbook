"use client";

import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Toggle } from "@/components/common/Toggle";
import { ColorPicker } from "@/components/common/ColorPicker";
import type { Flipbook, FlipbookSettings } from "@/types/flipbook";

interface BrandingSettingsProps {
  flipbook: Flipbook;
  onChange: (updates: { title?: string; description?: string; settings?: Partial<FlipbookSettings> }) => void;
}

export function BrandingSettings({ flipbook, onChange }: BrandingSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Branding</h3>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Title</label>
        <Input
          value={flipbook.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Description</label>
        <Input
          value={flipbook.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
      <ColorPicker
        label="Primary color"
        value={flipbook.settings.primaryColor}
        onChange={(v) => onChange({ settings: { primaryColor: v } })}
      />
      <ColorPicker
        label="Secondary color"
        value={flipbook.settings.secondaryColor || "#1e40af"}
        onChange={(v) => onChange({ settings: { secondaryColor: v } })}
      />
      <ColorPicker
        label="Background"
        value={flipbook.settings.background}
        onChange={(v) => onChange({ settings: { background: v } })}
      />
      <Toggle
        checked={flipbook.settings.showLogo}
        onChange={(v) => onChange({ settings: { showLogo: v } })}
        label="Show logo"
      />
      <div>
        <label className="mb-1 block text-sm text-slate-700">Logo upload (Phase 2)</label>
        <Input type="file" accept="image/*" disabled />
      </div>
    </div>
  );
}
