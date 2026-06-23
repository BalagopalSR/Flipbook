"use client";

import { useEffect, useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import type { Flipbook } from "@/types/flipbook";
import {
  accessStorageKey,
  isEmbedDomainAllowed,
  isFlipbookExpired,
} from "@/lib/flipbook-access";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";

type BlockReason = "expired" | "embed" | "password";

interface ViewerAccessGateProps {
  flipbook: Flipbook;
  children: React.ReactNode;
}

export function ViewerAccessGate({ flipbook, children }: ViewerAccessGateProps) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [blockReason, setBlockReason] = useState<BlockReason | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const settings = flipbook.settings;

  useEffect(() => {
    if (isFlipbookExpired(settings.expiryDate)) {
      setBlockReason("expired");
      setReady(true);
      return;
    }

    if (!isEmbedDomainAllowed(settings)) {
      setBlockReason("embed");
      setReady(true);
      return;
    }

    if (settings.passwordProtection) {
      const stored = sessionStorage.getItem(accessStorageKey(flipbook.id));
      if (stored === "1") {
        setUnlocked(true);
      } else {
        setBlockReason("password");
      }
    } else {
      setUnlocked(true);
    }

    setReady(true);
  }, [flipbook.id, settings]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const res = await fetch(`/api/flipbooks/${flipbook.id}/verify-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Incorrect password");
        return;
      }

      sessionStorage.setItem(accessStorageKey(flipbook.id), "1");
      setUnlocked(true);
      setBlockReason(null);
    } catch {
      setError("Unable to verify password. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (!ready) return null;

  if (unlocked) return <>{children}</>;

  if (blockReason === "expired") {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Flipbook expired</h2>
          <p className="mt-2 text-sm text-slate-600">
            This flipbook is no longer available. Update the expiry date in Customize to restore
            access.
          </p>
        </Card>
      </div>
    );
  }

  if (blockReason === "embed") {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Embedding not allowed</h2>
          <p className="mt-2 text-sm text-slate-600">
            This flipbook can only be embedded on approved domains. Open it directly or update the
            allowed domains in Customize.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <div className="mb-4 text-center">
          <Lock className="mx-auto h-10 w-10 text-brand-600" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Password required</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter the password to view &ldquo;{flipbook.title}&rdquo;.
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={verifying}>
            {verifying ? "Verifying..." : "Unlock flipbook"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
