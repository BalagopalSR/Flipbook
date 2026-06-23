import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isGoogleDocsUrl(url: string): boolean {
  return /docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+/.test(url);
}

export function isGoogleSlidesUrl(url: string): boolean {
  return /docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_-]+/.test(url);
}

export function getFlipSpeedMs(speed: "slow" | "normal" | "fast"): number {
  switch (speed) {
    case "slow":
      return 1200;
    case "fast":
      return 400;
    default:
      return 800;
  }
}

export function getShadowClass(intensity: "none" | "soft" | "medium" | "strong"): string {
  switch (intensity) {
    case "none":
      return "";
    case "soft":
      return "shadow-sm";
    case "strong":
      return "shadow-2xl";
    default:
      return "shadow-lg";
  }
}

export function getButtonRadius(style: "rounded" | "square" | "pill"): string {
  switch (style) {
    case "square":
      return "rounded-none";
    case "pill":
      return "rounded-full";
    default:
      return "rounded-lg";
  }
}
