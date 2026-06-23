"use client";

import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/common/Card";
import { Toggle } from "@/components/common/Toggle";
import { Select } from "@/components/common/Select";

export default function SettingsPage() {
  return (
    <AppShell>
      <TopBar title="Settings" subtitle="General application settings" />
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Card>
          <h2 className="mb-4 font-semibold text-slate-900">General</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-700">Default view mode</label>
              <Select defaultValue="flip">
                <option value="flip">Flipbook</option>
                <option value="slide">Slide</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-700">Default page mode</label>
              <Select defaultValue="double">
                <option value="single">Single page</option>
                <option value="double">Double page</option>
              </Select>
            </div>
            <Toggle checked={false} onChange={() => {}} label="Enable analytics tracking (Phase 2)" />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-slate-900">Account</h2>
          <p className="text-sm text-slate-500">
            Internal login is enabled. Default credentials are set via environment variables
            (AUTH_USERNAME / AUTH_PASSWORD). Change them in your <code>.env</code> file before deployment.
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-slate-900">Storage</h2>
          <p className="text-sm text-slate-500">
            Flipbooks are stored in a SQLite database on the server. All created flipbooks persist
            across sessions and are available from the dashboard after login.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
