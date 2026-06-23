export const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_PDF_PAGES_WARNING = 100;

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

export function validatePdfFile(file: File): ValidationResult {
  if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Invalid file type. Please upload a PDF file." };
  }
  if (file.size > MAX_PDF_SIZE) {
    return { valid: false, error: `File is too large. Maximum size is ${MAX_PDF_SIZE / 1024 / 1024}MB.` };
  }
  if (file.size > 20 * 1024 * 1024) {
    return { valid: true, warning: "Large PDF detected. Rendering may take longer." };
  }
  return { valid: true };
}

export function validateImageFile(file: File): ValidationResult {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const validExt = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (!validTypes.includes(file.type) && !validExt.includes(ext)) {
    return { valid: false, error: "Invalid file type. Supported: JPG, PNG, WEBP." };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image is too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB.` };
  }
  return { valid: true };
}

export function validatePptFile(file: File): ValidationResult {
  const validExt = [".ppt", ".pptx"];
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (!validExt.includes(ext)) {
    return { valid: false, error: "Invalid file type. Please upload PPT or PPTX." };
  }
  return { valid: true };
}
