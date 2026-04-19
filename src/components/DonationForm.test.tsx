import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DonationForm from "./DonationForm";
import { SITE_CONFIG } from "@/lib/constants";
import { PAYPAL_DONATE_URL } from "@/lib/paypal";

describe("DonationForm", () => {
  const originalLocation = window.location;
  let submitSpy: ReturnType<typeof vi.spyOn>;
  let submittedForms: HTMLFormElement[];

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: {
        ...originalLocation,
        origin: "https://moschee-pocking.de",
        href: "https://moschee-pocking.de/spenden",
      },
    });

    submittedForms = [];
    submitSpy = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(function (this: HTMLFormElement) {
        submittedForms.push(this);
      });
  });

  afterEach(() => {
    submitSpy.mockRestore();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  function getPayPalForm(): HTMLFormElement {
    const form = submittedForms.find((f) => f.action === PAYPAL_DONATE_URL);
    if (!form) throw new Error("No PayPal form was submitted");
    return form;
  }

  function fieldsOf(form: HTMLFormElement): Record<string, string> {
    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>("input[type=hidden]")
    );
    return Object.fromEntries(inputs.map((i) => [i.name, i.value]));
  }

  it("renders preset amount buttons", () => {
    render(<DonationForm />);
    expect(screen.getByRole("button", { name: /^10/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^20/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^50/ })).toBeInTheDocument();
  });

  it("selects preset amount on click", () => {
    render(<DonationForm />);
    fireEvent.click(screen.getByRole("button", { name: /^50/ }));
    const input = screen.getByLabelText(/Betrag/) as HTMLInputElement;
    expect(input.value).toBe("50");
  });

  it("shows error for empty amount and does not submit to PayPal", () => {
    render(<DonationForm />);
    fireEvent.click(screen.getByText("Mit PayPal spenden"));
    expect(screen.getByText(/gültigen Betrag/)).toBeInTheDocument();
    expect(submittedForms).toHaveLength(0);
  });

  it("has anonymous checkbox", () => {
    render(<DonationForm />);
    expect(screen.getByLabelText("Anonym spenden")).toBeInTheDocument();
  });

  it("shows Verwendungszweck", () => {
    render(<DonationForm />);
    expect(screen.getByText(/Moscheekauf/)).toBeInTheDocument();
  });

  it("POSTs to PayPal with the hosted button id and amount on valid submit", () => {
    render(<DonationForm />);
    fireEvent.click(screen.getByRole("button", { name: /^50/ }));
    fireEvent.click(screen.getByText("Mit PayPal spenden"));

    const form = getPayPalForm();
    expect(form.method).toBe("post");
    expect(form.target).toBe("_top");

    const fields = fieldsOf(form);
    expect(fields.hosted_button_id).toBe(SITE_CONFIG.paypal.hostedButtonId);
    expect(fields.currency_code).toBe("EUR");
    expect(fields.amount).toBe("50.00");
    expect(fields.item_name).toBe(SITE_CONFIG.paypal.itemName);
    expect(fields.no_shipping).toBe("1");
    expect(fields.return).toBe(
      "https://moschee-pocking.de/spenden?paypal=success"
    );
    expect(fields.cancel_return).toBe(
      "https://moschee-pocking.de/spenden?paypal=cancel"
    );
  });

  it("tags item_name as anonymous when checkbox is checked", () => {
    render(<DonationForm />);
    fireEvent.change(screen.getByLabelText(/Betrag/), {
      target: { value: "15" },
    });
    fireEvent.click(screen.getByLabelText("Anonym spenden"));
    fireEvent.click(screen.getByText("Mit PayPal spenden"));

    const fields = fieldsOf(getPayPalForm());
    expect(fields.amount).toBe("15.00");
    expect(fields.item_name).toBe(`${SITE_CONFIG.paypal.itemName} (anonym)`);
  });

  it("disables the submit button while redirecting", () => {
    render(<DonationForm />);
    fireEvent.click(screen.getByRole("button", { name: /^20/ }));
    fireEvent.click(screen.getByRole("button", { name: /Mit PayPal spenden/ }));
    expect(
      screen.getByRole("button", { name: /Weiterleitung zu PayPal/ })
    ).toBeDisabled();
  });
});
