"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      // fallback mailto if required fields missing
      window.location.href = `mailto:hello@example.com?subject=Contact%20from%20${encodeURIComponent(name || "Website")}&body=${encodeURIComponent(message)}`;
      return;
    }
    if (!endpoint) {
      window.location.href = `mailto:hello@example.com?subject=Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\n(" + email + ")")}`;
      return;
    }
    setSubmitting(true);
    try {
      await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ type: "contact", name, email, message, createdAt: new Date().toISOString() }),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      window.location.href = `mailto:hello@example.com?subject=Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\n(" + email + ")")}`;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Contact</h1>
      <p className="mt-6 text-slate-700">We keep things simple. Share a note and we’ll get back thoughtfully.</p>
      <form onSubmit={onSubmit} className="mt-10 grid gap-4" aria-live="polite">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          rows={6}
          className="rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, y: -2, boxShadow: "0 24px 80px rgba(189,134,101,0.25)" }}
          whileTap={{ scale: 0.98, y: 0 }}
          disabled={submitting}
          aria-busy={submitting}
          className="mt-2 w-fit rounded-full px-6 py-3 bg-slate-800 text-offwhite accent-ring elevate-hover"
        >
          {submitting ? "Sending..." : success ? "Sent" : "Send"}
        </motion.button>
      </form>
    </div>
  );
}


