"use client";

import { Select } from "@/components/common/Select";
import { Toggle } from "@/components/common/Toggle";
import type { FlipbookSettings } from "@/types/flipbook";

interface ToolbarSettingsProps {
  settings: FlipbookSettings;
  onChange: (updates: Partial<FlipbookSettings>) => void;
}

export function ToolbarSettings({ settings, onChange }: ToolbarSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Toolbar & Controls</h3>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Toolbar style</label>
        <Select
          value={settings.toolbarStyle}
          onChange={(e) =>
            onChange({ toolbarStyle: e.target.value as FlipbookSettings["toolbarStyle"] })
          }
        >
          <option value="minimal">Minimal</option>
          <option value="classic">Classic</option>
          <option value="floating">Floating</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Button style</label>
        <Select
          value={settings.buttonStyle}
          onChange={(e) =>
            onChange({ buttonStyle: e.target.value as FlipbookSettings["buttonStyle"] })
          }
        >
          <option value="rounded">Rounded</option>
          <option value="square">Square</option>
          <option value="pill">Pill</option>
        </Select>
      </div>
      <Toggle
        checked={settings.showPagination}
        onChange={(v) => onChange({ showPagination: v })}
        label="Show pagination"
      />
      <Toggle
        checked={settings.showDownload}
        onChange={(v) => onChange({ showDownload: v })}
        label="Show download button"
      />
      <Toggle
        checked={settings.showShare}
        onChange={(v) => onChange({ showShare: v })}
        label="Show share button"
      />
      <Toggle
        checked={settings.showFullscreen}
        onChange={(v) => onChange({ showFullscreen: v })}
        label="Show fullscreen button"
      />
      <Toggle
        checked={settings.showPrint}
        onChange={(v) => onChange({ showPrint: v })}
        label="Show print button"
      />
      <Toggle
        checked={settings.showThumbnails}
        onChange={(v) => onChange({ showThumbnails: v })}
        label="Show thumbnail sidebar"
      />
    </div>
  );
}
