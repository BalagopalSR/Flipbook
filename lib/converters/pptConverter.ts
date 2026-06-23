export interface PptImportResult {
  success: false;
  message: string;
  fileName: string;
}

/**
 * Phase 2 PPT/PPTX import pipeline:
 * 1. Upload PPT/PPTX to server
 * 2. Server-side conversion to PDF (LibreOffice, CloudConvert, etc.)
 * 3. Pass converted PDF to pdfConverter.convertPdfToPages()
 * 4. Return FlipbookPage[]
 *
 * Browser-only PPT conversion is unreliable and not attempted in MVP.
 */
export async function importPpt(file: File): Promise<PptImportResult> {
  // Phase 2: Upload to server and convert
  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await fetch('/api/convert-ppt', { method: 'POST', body: formData });
  // const pdfBlob = await response.blob();
  // return convertPdfToPages(pdfBlob);

  return {
    success: false,
    message:
      "PowerPoint conversion requires server-side document conversion. In Phase 2, PPT/PPTX files can be converted to PDF using LibreOffice, CloudConvert, or another conversion service, then rendered through the existing PDF pipeline.",
    fileName: file.name,
  };
}
