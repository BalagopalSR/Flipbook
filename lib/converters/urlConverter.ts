import { isValidUrl } from "@/lib/utils/cn";

export interface UrlImportResult {
  success: false;
  message: string;
  url: string;
}

/**
 * Phase 2 URL import pipeline:
 * 1. User provides public PDF or image URL
 * 2. Backend fetches file (required to avoid CORS issues)
 * 3. Validate content-type (application/pdf, image/*)
 * 4. Route to appropriate converter (pdfConverter or imageConverter)
 * 5. Return FlipbookPage[]
 *
 * NOTE: Server-side fetching is required because browsers cannot fetch
 * arbitrary cross-origin URLs due to CORS restrictions.
 */
export async function importFromUrl(url: string): Promise<UrlImportResult> {
  if (!isValidUrl(url)) {
    return {
      success: false,
      message: "Invalid URL format. Please enter a valid URL.",
      url,
    };
  }

  // Phase 2: Backend endpoint to fetch and convert
  // const response = await fetch('/api/import-url', { method: 'POST', body: JSON.stringify({ url }) });
  // const blob = await response.blob();
  // return convert based on content-type

  return {
    success: false,
    message:
      "Direct URL import is not available in this MVP. In Phase 2, a backend service will fetch the file, validate the content type, and convert it into a flipbook. Server-side fetching is required to avoid CORS issues.",
    url,
  };
}
