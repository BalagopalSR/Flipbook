"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeBoxProps {
  url: string;
}

export function QRCodeBox({ url }: QRCodeBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, { width: 160, margin: 2 });
    }
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} aria-label="QR code for share link" />
      <p className="text-xs text-slate-500">Scan to view flipbook</p>
    </div>
  );
}
