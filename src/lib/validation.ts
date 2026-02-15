export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateDonationForm(data: {
  amount: string;
  anonymous: boolean;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const amount = parseFloat(data.amount);

  if (!data.amount || isNaN(amount)) {
    errors.amount = "Bitte geben Sie einen gültigen Betrag ein.";
  } else if (amount <= 0) {
    errors.amount = "Der Betrag muss größer als 0 sein.";
  } else if (amount > 100000) {
    errors.amount = "Der Betrag ist zu hoch.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Bitte geben Sie Ihren Namen ein.";
  }

  if (!data.email.trim()) {
    errors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  if (!data.subject.trim()) {
    errors.subject = "Bitte geben Sie einen Betreff ein.";
  }

  if (!data.message.trim()) {
    errors.message = "Bitte geben Sie eine Nachricht ein.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
