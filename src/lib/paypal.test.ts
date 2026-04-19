import { describe, it, expect, vi } from "vitest";
import {
  PAYPAL_DONATE_URL,
  buildPayPalHostedButtonFields,
  submitPayPalDonation,
} from "./paypal";

describe("buildPayPalHostedButtonFields", () => {
  const base = {
    hostedButtonId: "5UE27E84TA9L4",
    amount: 25,
    itemName: "Moscheekauf Pocking",
  };

  it("emits the hosted_button_id and defaults to EUR + no_shipping=1", () => {
    const f = buildPayPalHostedButtonFields(base);
    expect(f.hosted_button_id).toBe("5UE27E84TA9L4");
    expect(f.currency_code).toBe("EUR");
    expect(f.no_shipping).toBe("1");
  });

  it("formats amount with two decimals", () => {
    expect(buildPayPalHostedButtonFields(base).amount).toBe("25.00");
    expect(
      buildPayPalHostedButtonFields({ ...base, amount: 12.5 }).amount
    ).toBe("12.50");
  });

  it("omits amount when not provided (lets PayPal use button defaults)", () => {
    const f = buildPayPalHostedButtonFields({
      hostedButtonId: base.hostedButtonId,
    });
    expect(f.amount).toBeUndefined();
    expect(f.hosted_button_id).toBe("5UE27E84TA9L4");
  });

  it("allows overriding currency", () => {
    expect(
      buildPayPalHostedButtonFields({ ...base, currency: "USD" }).currency_code
    ).toBe("USD");
  });

  it("passes item_name when non-empty", () => {
    expect(buildPayPalHostedButtonFields(base).item_name).toBe(
      "Moscheekauf Pocking"
    );
    expect(
      buildPayPalHostedButtonFields({ ...base, itemName: "   " }).item_name
    ).toBeUndefined();
  });

  it("passes return/cancel URLs when provided", () => {
    const f = buildPayPalHostedButtonFields({
      ...base,
      returnUrl: "https://example.org/spenden?paypal=success",
      cancelUrl: "https://example.org/spenden?paypal=cancel",
    });
    expect(f.return).toBe("https://example.org/spenden?paypal=success");
    expect(f.cancel_return).toBe("https://example.org/spenden?paypal=cancel");
  });

  it("rejects missing hostedButtonId", () => {
    expect(() =>
      buildPayPalHostedButtonFields({ ...base, hostedButtonId: "" })
    ).toThrow();
    expect(() =>
      buildPayPalHostedButtonFields({ ...base, hostedButtonId: "   " })
    ).toThrow();
  });

  it("rejects zero, negative or non-finite amount", () => {
    expect(() =>
      buildPayPalHostedButtonFields({ ...base, amount: 0 })
    ).toThrow();
    expect(() =>
      buildPayPalHostedButtonFields({ ...base, amount: -1 })
    ).toThrow();
    expect(() =>
      buildPayPalHostedButtonFields({ ...base, amount: Number.NaN })
    ).toThrow();
  });
});

describe("submitPayPalDonation", () => {
  it("creates a form POSTing to PayPal with hidden inputs for every field, then removes it", () => {
    const submitSpy = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(() => {});

    const capturedForms: HTMLFormElement[] = [];
    const appendSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation(((node: Node) => {
        if (node instanceof HTMLFormElement) capturedForms.push(node);
        return node;
      }) as typeof document.body.appendChild);

    submitPayPalDonation({
      hosted_button_id: "5UE27E84TA9L4",
      amount: "25.00",
      currency_code: "EUR",
      item_name: "Moscheekauf Pocking",
      no_shipping: "1",
      return: "https://example.org/spenden?paypal=success",
    });

    expect(submitSpy).toHaveBeenCalledOnce();
    expect(capturedForms).toHaveLength(1);

    const form = capturedForms[0];
    expect(form.method).toBe("post");
    expect(form.action).toBe(PAYPAL_DONATE_URL);
    expect(form.target).toBe("_top");

    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>("input[type=hidden]")
    );
    const byName = Object.fromEntries(inputs.map((i) => [i.name, i.value]));
    expect(byName.hosted_button_id).toBe("5UE27E84TA9L4");
    expect(byName.amount).toBe("25.00");
    expect(byName.currency_code).toBe("EUR");
    expect(byName.item_name).toBe("Moscheekauf Pocking");
    expect(byName.no_shipping).toBe("1");
    expect(byName.return).toBe("https://example.org/spenden?paypal=success");

    expect(form.isConnected).toBe(false);

    submitSpy.mockRestore();
    appendSpy.mockRestore();
  });
});
