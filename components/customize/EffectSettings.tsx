"use client";

import { Select } from "@/components/common/Select";
import { Toggle } from "@/components/common/Toggle";
import type { FlipbookSettings } from "@/types/flipbook";

interface EffectSettingsProps {
  settings: FlipbookSettings;
  onChange: (updates: Partial<FlipbookSettings>) => void;
}

export function EffectSettings({ settings, onChange }: EffectSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Effects</h3>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Default view mode</label>
        <Select
          value={settings.effect}
          onChange={(e) => onChange({ effect: e.target.value as FlipbookSettings["effect"] })}
        >
          <option value="flip">Flipbook</option>
          <option value="slide">Slide</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Page mode</label>
        <Select
          value={settings.pageMode}
          onChange={(e) => onChange({ pageMode: e.target.value as FlipbookSettings["pageMode"] })}
        >
          <option value="single">Single page</option>
          <option value="double">Double page</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Flip speed</label>
        <Select
          value={settings.flipSpeed}
          onChange={(e) => onChange({ flipSpeed: e.target.value as FlipbookSettings["flipSpeed"] })}
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">Shadow intensity</label>
        <Select
          value={settings.shadowIntensity}
          onChange={(e) =>
            onChange({ shadowIntensity: e.target.value as FlipbookSettings["shadowIntensity"] })
          }
        >
          <option value="none">None</option>
          <option value="soft">Soft</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700">
          Page corner radius: {settings.borderRadius}px
        </label>
        <input
          type="range"
          min={0}
          max={20}
          value={settings.borderRadius}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          className="w-full"
          aria-label="Page corner radius"
        />
      </div>
      <Toggle
        checked={settings.soundEnabled}
        onChange={(v) => onChange({ soundEnabled: v })}
        label="Page flip sound"
      />
      <Toggle checked={settings.rtl} onChange={(v) => onChange({ rtl: v })} label="Right-to-left reading" />
      <Toggle checked={settings.autoplay} onChange={(v) => onChange({ autoplay: v })} label="Auto-play" />
      {settings.autoplay && (
        <>
          <div>
            <label className="mb-1 block text-sm text-slate-700">
              Auto-play interval: {settings.autoplayInterval / 1000}s
            </label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={settings.autoplayInterval}
              onChange={(e) => onChange({ autoplayInterval: Number(e.target.value) })}
              className="w-full"
              aria-label="Autoplay interval"
            />
          </div>
          <Toggle
            checked={settings.loopAutoplay}
            onChange={(v) => onChange({ loopAutoplay: v })}
            label="Loop autoplay"
          />
        </>
      )}
    </div>
  );
}
