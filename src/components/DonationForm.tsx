"use client";

import { useState } from "react";
import { validateDonationForm } from "@/lib/validation";

export default function DonationForm() {
  const [amount, setAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateDonationForm({ amount, anonymous });
    setErrors(result.errors);

    if (result.valid) {
      // In production: redirect to PayPal or process payment
      alert(
        `Vielen Dank für Ihre Spende von ${amount} €! (PayPal-Integration folgt)`
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Preset amounts */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setAmount(String(preset));
              setErrors({});
            }}
            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
              amount === String(preset)
                ? "bg-mosque-green-600 text-white border-mosque-green-600"
                : "border-gray-300 hover:border-mosque-green-400"
            }`}
          >
            {preset} €
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="mb-4">
        <label
          htmlFor="donation-amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Betrag (€)
        </label>
        <input
          id="donation-amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors({});
          }}
          placeholder="Freier Betrag"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mosque-green-500 focus:border-transparent"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Anonymous */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="rounded border-gray-300"
          />
          Anonym spenden
        </label>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Verwendungszweck: Moscheekauf
      </p>

      {/* PayPal Button */}
      <button
        type="submit"
        className="w-full bg-mosque-gold-400 text-mosque-green-900 font-bold py-3 rounded-xl hover:bg-mosque-gold-300 transition-colors"
      >
        Mit PayPal spenden
      </button>
    </form>
  );
}
