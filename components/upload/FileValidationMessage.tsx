import { AlertCircle, AlertTriangle } from "lucide-react";

interface FileValidationMessageProps {
  error?: string;
  warning?: string;
}

export function FileValidationMessage({ error, warning }: FileValidationMessageProps) {
  if (!error && !warning) return null;
  return (
    <div
      className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${
        error ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
      }`}
      role="alert"
    >
      {error ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{error || warning}</span>
    </div>
  );
}
