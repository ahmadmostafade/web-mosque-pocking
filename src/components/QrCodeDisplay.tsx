"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { generateEpcQrData } from "@/lib/qr-code";

export default function QrCodeDisplay() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const data = generateEpcQrData();
    QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: { dark: "#14532d", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, []);

  if (!qrDataUrl) return <div className="w-[200px] h-[200px] bg-gray-100 rounded animate-pulse" />;

  return (
    <div className="flex flex-col items-center">
      <img
        src={qrDataUrl}
        alt="QR-Code für Banküberweisung"
        width={200}
        height={200}
        className="rounded-lg"
      />
      <p className="text-xs text-gray-500 mt-2">
        Scannen für Banküberweisung
      </p>
    </div>
  );
}
