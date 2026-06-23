import type { FlipbookSettings } from "@/types/flipbook";

export function isFlipbookExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const end = new Date(`${expiryDate}T23:59:59.999`);
  return !Number.isNaN(end.getTime()) && Date.now() > end.getTime();
}

function normalizeDomain(value: string): string {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

export function isEmbedDomainAllowed(settings: FlipbookSettings): boolean {
  if (!settings.domainRestrictedEmbed) return true;

  const allowed = (settings.allowedEmbedDomains || "")
    .split(",")
    .map(normalizeDomain)
    .filter(Boolean);

  if (allowed.length === 0) return false;

  if (typeof window === "undefined") return true;
  if (window.self === window.top) return true;

  const candidates: string[] = [];
  if (document.referrer) {
    try {
      candidates.push(normalizeDomain(new URL(document.referrer).host));
    } catch {
      // ignore invalid referrer
    }
  }

  const ancestorOrigins = (location as Location & { ancestorOrigins?: DOMStringList })
    .ancestorOrigins;
  if (ancestorOrigins) {
    for (let i = 0; i < ancestorOrigins.length; i++) {
      try {
        candidates.push(normalizeDomain(new URL(ancestorOrigins[i]).host));
      } catch {
        // ignore invalid origin
      }
    }
  }

  if (candidates.length === 0) return false;

  return candidates.some((host) =>
    allowed.some((domain) => host === domain || host.endsWith(`.${domain}`))
  );
}

export function accessStorageKey(flipbookId: string): string {
  return `flipbook-access-${flipbookId}`;
}
