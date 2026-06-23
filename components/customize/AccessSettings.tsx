"use client";

import { useState } from "react";
import { Toggle } from "@/components/common/Toggle";
import { Input } from "@/components/common/Input";
import type { FlipbookSettings } from "@/types/flipbook";

interface AccessSettingsProps {
  settings: FlipbookSettings;
  onChange: (updates: Partial<FlipbookSettings>) => void;
}

export function AccessSettings({ settings, onChange }: AccessSettingsProps) {
  const [newPassword, setNewPassword] = useState("");

  const isPublic = settings.isPublic ?? true;
  const passwordProtection = settings.passwordProtection ?? false;
  const domainRestrictedEmbed = settings.domainRestrictedEmbed ?? false;

  const handlePasswordProtectionChange = (enabled: boolean) => {
    if (!enabled) setNewPassword("");
    onChange({
      passwordProtection: enabled,
      ...(enabled ? {} : { accessPassword: undefined }),
    });
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (value.trim()) {
      onChange({ accessPassword: value.trim() });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Access & Security</h3>
      <p className="text-xs text-slate-500">
        Control who can view this flipbook and which actions are available in the viewer.
      </p>

      <Toggle
        checked={isPublic}
        onChange={(v) => onChange({ isPublic: v })}
        label="Public flipbook"
      />

      <Toggle
        checked={passwordProtection}
        onChange={handlePasswordProtectionChange}
        label="Password protection"
      />

      {passwordProtection && (
        <div>
          <label className="mb-1 block text-sm text-slate-700">Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            placeholder={
              settings.hasAccessPassword ? "Enter new password to change..." : "Set password..."
            }
          />
          {settings.hasAccessPassword && !newPassword && (
            <p className="mt-1 text-xs text-slate-500">A password is already set.</p>
          )}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-slate-700">Expiry date</label>
        <Input
          type="date"
          value={settings.expiryDate || ""}
          onChange={(e) => onChange({ expiryDate: e.target.value || undefined })}
        />
        <p className="mt-1 text-xs text-slate-500">
          Leave empty for no expiry. The viewer is blocked after this date.
        </p>
      </div>

      <Toggle
        checked={!settings.showDownload}
        onChange={(v) => onChange({ showDownload: !v })}
        label="Disable download"
      />
      <Toggle
        checked={!settings.showPrint}
        onChange={(v) => onChange({ showPrint: !v })}
        label="Disable print"
      />

      <Toggle
        checked={domainRestrictedEmbed}
        onChange={(v) => onChange({ domainRestrictedEmbed: v })}
        label="Domain-restricted embed"
      />

      {domainRestrictedEmbed && (
        <div>
          <label className="mb-1 block text-sm text-slate-700">Allowed domains</label>
          <Input
            value={settings.allowedEmbedDomains || ""}
            onChange={(e) => onChange({ allowedEmbedDomains: e.target.value })}
            placeholder="example.com, app.example.com"
          />
          <p className="mt-1 text-xs text-slate-500">
            Comma-separated hostnames. Direct viewing is always allowed.
          </p>
        </div>
      )}
    </div>
  );
}
