"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  purpose: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  purpose: "General interest",
};

export default function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purposes = useMemo(
    () => [
      "General interest",
      "Pilot evaluation",
      "Academic research",
      "Partnership",
    ],
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email) {
      setError("Please fill out required fields.");
      return;
    }
    setSubmitting(true);
    try {
      // Endpoint: set NEXT_PUBLIC_SHEETS_WEBHOOK in environment
      const endpoint = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK;
      if (!endpoint) throw new Error("Missing Sheets webhook endpoint");

      const res = await fetch(endpoint, {
        method: "POST",
        // Send as a simple request (text/plain default) to avoid CORS preflight
        body: JSON.stringify({
          ...form,
          type: "waitlist",
          createdAt: new Date().toISOString(),
          source: "website-waitlist",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSuccess(true);
      setForm(initialState);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-6 md:p-8 bg-white/30 elevate"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="mx-auto mb-4 h-12 w-12 rounded-full bg-tan-200/60 ring-2 ring-tan-300 flex items-center justify-center"
              >
                <span className="text-slate-800">✓</span>
              </motion.div>
              <h3 className="font-serif text-2xl text-slate-800">Thanks for your interest!</h3>
              <p className="mt-2 text-slate-700">We'll reach out as we expand access.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Name*</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Company</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Role</label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
                    placeholder="Product Manager"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Purpose</label>
                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-3 bg-white/70 border border-slate-800/10 focus:outline-none focus:ring-2 focus:ring-tan-300 shimmer-focus"
                >
                  {purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 24px 80px rgba(189,134,101,0.25)" }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  disabled={submitting}
                  aria-busy={submitting}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-slate-800 text-offwhite accent-ring elevate-hover"
                >
                  {submitting ? "Sending..." : "Express Interest"}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


