import { describe, it, expect } from "vitest";
import { validateDonationForm, validateContactForm } from "./validation";

describe("validateDonationForm", () => {
  it("accepts valid donation", () => {
    const result = validateDonationForm({ amount: "50", anonymous: false });
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("rejects empty amount", () => {
    const result = validateDonationForm({ amount: "", anonymous: false });
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBeTruthy();
  });

  it("rejects negative amount", () => {
    const result = validateDonationForm({ amount: "-10", anonymous: false });
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBeTruthy();
  });

  it("rejects zero amount", () => {
    const result = validateDonationForm({ amount: "0", anonymous: false });
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBeTruthy();
  });

  it("rejects excessively large amount", () => {
    const result = validateDonationForm({
      amount: "200000",
      anonymous: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBeTruthy();
  });
});

describe("validateContactForm", () => {
  const validData = {
    name: "Max Mustermann",
    email: "max@example.com",
    subject: "Frage",
    message: "Hallo, ich habe eine Frage.",
  };

  it("accepts valid contact form", () => {
    const result = validateContactForm(validData);
    expect(result.valid).toBe(true);
  });

  it("rejects empty name", () => {
    const result = validateContactForm({ ...validData, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
  });

  it("rejects invalid email", () => {
    const result = validateContactForm({ ...validData, email: "invalid" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it("rejects empty subject", () => {
    const result = validateContactForm({ ...validData, subject: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.subject).toBeTruthy();
  });

  it("rejects empty message", () => {
    const result = validateContactForm({ ...validData, message: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeTruthy();
  });
});
