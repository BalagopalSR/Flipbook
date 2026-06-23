"use client";

import { useState } from "react";
import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Link2,
  Presentation,
} from "lucide-react";
import { Tabs } from "@/components/common/Tabs";
import { PdfUploader } from "./PdfUploader";
import { ImageUploader } from "./ImageUploader";
import { GoogleDocsImport } from "./GoogleDocsImport";
import { GoogleSlidesImport } from "./GoogleSlidesImport";
import { UrlImport } from "./UrlImport";
import { PptImportPlaceholder } from "./PptImportPlaceholder";

const tabs = [
  { id: "pdf", label: "PDF", icon: <FileText className="h-4 w-4" /> },
  { id: "images", label: "Images", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "google-docs", label: "Google Docs", icon: <FileText className="h-4 w-4" /> },
  { id: "google-slides", label: "Google Slides", icon: <Presentation className="h-4 w-4" /> },
  { id: "url", label: "URL", icon: <Link2 className="h-4 w-4" /> },
  { id: "ppt", label: "PPT/PPTX", icon: <FileSpreadsheet className="h-4 w-4" /> },
];

export function UploadTabs() {
  const [activeTab, setActiveTab] = useState("pdf");

  const renderContent = () => {
    switch (activeTab) {
      case "pdf":
        return <PdfUploader />;
      case "images":
        return <ImageUploader />;
      case "google-docs":
        return <GoogleDocsImport />;
      case "google-slides":
        return <GoogleSlidesImport />;
      case "url":
        return <UrlImport />;
      case "ppt":
        return <PptImportPlaceholder />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
