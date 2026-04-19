export const PAYPAL_DONATE_URL = "https://www.paypal.com/donate";

export interface PayPalHostedButtonParams {
  hostedButtonId: string;
  amount?: number;
  itemName?: string;
  currency?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

/**
 * Returns the form fields to POST to {@link PAYPAL_DONATE_URL} for a hosted
 * donation button. The button's identity is pre-registered at PayPal, which
 * avoids runtime fraud checks on the receiver email. `amount` is honored only
 * when the button is configured for donor-specified amounts; otherwise PayPal
 * silently ignores it and shows its own amount picker.
 */
export function buildPayPalHostedButtonFields(
  params: PayPalHostedButtonParams
): Record<string, string> {
  const {
    hostedButtonId,
    amount,
    itemName,
    currency = "EUR",
    returnUrl,
    cancelUrl,
  } = params;

  if (!hostedButtonId || !hostedButtonId.trim()) {
    throw new Error("hostedButtonId is required.");
  }
  if (amount !== undefined) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Amount must be a positive, finite number.");
    }
  }

  const fields: Record<string, string> = {
    hosted_button_id: hostedButtonId,
    currency_code: currency,
    no_shipping: "1",
  };
  if (amount !== undefined) fields.amount = amount.toFixed(2);
  if (itemName && itemName.trim()) fields.item_name = itemName;
  if (returnUrl) fields.return = returnUrl;
  if (cancelUrl) fields.cancel_return = cancelUrl;

  return fields;
}

/**
 * Creates a hidden form, posts it to PayPal, and removes it. Used client-side
 * to redirect the browser to PayPal's hosted donation checkout.
 */
export function submitPayPalDonation(
  fields: Record<string, string>,
  doc: Document = document
): void {
  const form = doc.createElement("form");
  form.method = "post";
  form.action = PAYPAL_DONATE_URL;
  form.target = "_top";

  for (const [name, value] of Object.entries(fields)) {
    const input = doc.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  doc.body.appendChild(form);
  form.submit();
  form.remove();
}
