import type { FlipbookSettings } from "@/types/flipbook";
import { DEFAULT_SETTINGS } from "@/types/flipbook";

export function mergeFlipbookSettings(
  partial?: Partial<FlipbookSettings> | null
): FlipbookSettings {
  return { ...DEFAULT_SETTINGS, ...partial };
}

export function sanitizeSettingsForClient(settings: FlipbookSettings): FlipbookSettings {
  const { accessPasswordHash, accessPassword, ...rest } = settings;
  return {
    ...mergeFlipbookSettings(rest),
    hasAccessPassword: !!accessPasswordHash,
  };
}
