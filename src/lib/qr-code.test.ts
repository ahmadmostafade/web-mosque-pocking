import { describe, it, expect } from "vitest";
import { generateEpcQrData } from "./qr-code";

describe("generateEpcQrData", () => {
  it("generates valid EPC QR code data", () => {
    const data = generateEpcQrData();
    expect(data).toContain("BCD");
    expect(data).toContain("SCT");
    expect(data).toContain("Moscheekauf");
  });

  it("includes amount when provided", () => {
    const data = generateEpcQrData(50);
    expect(data).toContain("EUR50.00");
  });

  it("omits amount field when not provided", () => {
    const data = generateEpcQrData();
    const lines = data.split("\n");
    // Line 8 (index 7) is the amount field
    expect(lines[7]).toBe("");
  });

  it("strips spaces from IBAN", () => {
    const data = generateEpcQrData();
    const lines = data.split("\n");
    // Line 7 (index 6) is the IBAN
    expect(lines[6]).not.toContain(" ");
  });
});
