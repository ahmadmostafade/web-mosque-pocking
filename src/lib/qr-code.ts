import { SITE_CONFIG } from "./constants";

/**
 * Generate EPC QR code data string for SEPA bank transfers.
 * Format: EPC069-12 (European Payments Council Quick Response Code)
 */
export function generateEpcQrData(amount?: number): string {
  const { bic, accountHolder, iban, reference } = SITE_CONFIG.bankDetails;

  const lines = [
    "BCD", // Service Tag
    "002", // Version
    "1", // Encoding (UTF-8)
    "SCT", // SEPA Credit Transfer
    bic,
    accountHolder,
    iban.replace(/\s/g, ""),
    amount ? `EUR${amount.toFixed(2)}` : "",
    "", // Purpose
    reference,
    "", // Display text
  ];

  return lines.join("\n");
}
