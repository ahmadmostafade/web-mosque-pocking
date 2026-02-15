"use client";

import { useState } from "react";
import { validateContactForm } from "@/lib/validation";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot spam check
    if (honeypot) return;

    const result = validateContactForm(formData);
    setErrors(result.errors);

    if (result.valid) {
      setSending(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, website: honeypot }),
        });
        if (res.ok) {
          setSubmitted(true);
        } else {
          const data = await res.json();
          setErrors(data.errors || { form: "Ein Fehler ist aufgetreten." });
        }
      } catch {
        setErrors({ form: "Ein Fehler ist aufgetreten." });
      } finally {
        setSending(false);
      }
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-mosque-green-600 font-semibold text-lg">
          ✅ Vielen Dank für Ihre Nachricht!
        </p>
        <p className="text-gray-600 mt-2">
          Wir werden uns so schnell wie möglich bei Ihnen melden.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mosque-green-500 focus:border-transparent"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mosque-green-500 focus:border-transparent"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
            Betreff *
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mosque-green-500 focus:border-transparent"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
            Nachricht *
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mosque-green-500 focus:border-transparent"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-mosque-green-600 text-white font-bold py-3 rounded-xl hover:bg-mosque-green-700 transition-colors"
        >
          Nachricht senden
        </button>
        {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}
      </div>
    </form>
  );
}
