import type { FlipbookSettings } from "@/types/flipbook";
import { hashPassword } from "@/lib/auth";
import { mergeFlipbookSettings } from "@/lib/flipbook-settings";

export async function processSettingsForSave(
  incoming: Partial<FlipbookSettings>,
  existingSettingsJson?: string
): Promise<FlipbookSettings> {
  const existing = mergeFlipbookSettings(
    existingSettingsJson ? JSON.parse(existingSettingsJson) : undefined
  );
  const merged = mergeFlipbookSettings({ ...existing, ...incoming });

  const newPassword = incoming.accessPassword?.trim();
  if (newPassword) {
    merged.accessPasswordHash = await hashPassword(newPassword);
  }

  if (!merged.passwordProtection) {
    delete merged.accessPasswordHash;
  }

  delete merged.accessPassword;
  delete merged.hasAccessPassword;

  return merged;
}
