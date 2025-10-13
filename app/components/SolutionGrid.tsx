"use client";

import { motion } from "framer-motion";

export default function SolutionGrid() {
  const cards = [
    { title: "Speed", tagline: "Feedback in minutes, not weeks.", desc: "Real-time feedback on our platform or in CI/CD. Hassle-free integration." },
    { title: "Cost", tagline: "10x+ cheaper", desc: "No human panels required. No lost productivity waiting on feedback." },
    { title: "Precision", tagline: "Stanford HCI-backed", desc: "Scientifically validated metrics from leaders in UI/UX design and research." },
  ];

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {cards.map((c) => (
        <motion.div
          key={c.title}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="glass rounded-xl p-6 ring-0 hover:ring-2 hover:ring-tan-300/70 hover:shadow-xl hover:shadow-slate-800/10 backdrop-saturate-150"
        >
          <h4 className="font-serif text-xl">{c.title}</h4>
          <p className="mt-2 text-slate-800">{c.tagline}</p>
          <p className="mt-2 text-slate-700 text-sm">{c.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}


