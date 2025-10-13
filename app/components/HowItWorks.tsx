"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function OrbitIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="20" cy="20" r="6" fill="#BD8665" fillOpacity="0.9" />
      <ellipse cx="20" cy="20" rx="14" ry="8" stroke="#4A5568" strokeOpacity="0.5" />
      <ellipse cx="20" cy="20" rx="18" ry="12" stroke="#4A5568" strokeOpacity="0.3" />
    </svg>
  );
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // Flashcard flip sequence pinned to viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-flip-step]");
      if (cards.length === 0) return;

      // initial states
      gsap.set(cards, { transformOrigin: "50% 50%", rotateX: 90, opacity: 0, backfaceVisibility: "hidden" });
      gsap.set(cards[0], { rotateX: 0, opacity: 1 });

      // inner card elements for shadow anims
      const inners = cards.map((c) => c.querySelector(".hiw-card") as HTMLElement);
      gsap.set(inners, { boxShadow: "0 16px 48px rgba(45,55,72,0.10)" });

      const snapPoints = Array.from({ length: cards.length }, (_, i) =>
        cards.length > 1 ? i / (cards.length - 1) : 0
      );

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.6 },
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=240%",
          scrub: true,
          pin: true,
          snap: {
            snapTo: snapPoints,
            duration: { min: 0.2, max: 0.6 },
            ease: "power2.inOut",
          },
        },
      });

      // step 1 -> 2
      if (cards[1]) {
        tl.to(cards[0], { rotateX: -90, opacity: 0.25 }, 0)
          .to(inners[0], { boxShadow: "0 10px 30px rgba(45,55,72,0.08)" }, 0)
          .to(cards[1], { rotateX: 0, opacity: 1 }, 0.0)
          .to(inners[1], { boxShadow: "0 40px 120px rgba(45,55,72,0.25)" }, 0.0);
      }
      // step 2 -> 3
      if (cards[2]) {
        tl.to(cards[1], { rotateX: -90, opacity: 0.25 }, ">")
          .to(inners[1], { boxShadow: "0 10px 30px rgba(45,55,72,0.08)" }, "<")
          .to(cards[2], { rotateX: 0, opacity: 1 }, "<")
          .to(inners[2], { boxShadow: "0 40px 120px rgba(45,55,72,0.25)" }, "<");
      }

      // progress dots update
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=240%",
        onUpdate: (self) => {
          const idx = Math.min(cards.length - 1, Math.floor(self.progress * cards.length + 0.0001));
          setActive(idx);
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      title: "Spin Up Agents",
      desc: "Launch realistic synthetic users tailored to your product and scenarios.",
    },
    {
      title: "Autonomous Testing",
      desc: "Agents explore flows, report issues, and generate actionable metrics automatically.",
    },
    {
      title: "Instant Insights",
      desc: "Get prioritized findings and dashboards directly in your workflow.",
    },
  ];

  return (
    <section id="how" className="relative w-full bg-offwhite pt-24 md:pt-28">
      <div ref={containerRef} className="relative h-[100svh] w-full perspective-[1200px] overflow-hidden">
        {/* Fixed heading and progress dots while pinned */}
        <div className="pointer-events-none absolute left-0 right-0 flex items-center justify-between px-6 z-20 top-20 md:top-24">
          <h2 className="pointer-events-none font-serif text-2xl md:text-3xl">How it works</h2>
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-opacity ${active === i ? "bg-slate-800 opacity-100" : "bg-slate-800/40 opacity-60"}`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
        </div>
        {steps.map((s, i) => (
          <div
            key={s.title}
            data-flip-step
            className="absolute inset-0 flex items-center justify-center will-change-transform"
            style={{ zIndex: steps.length - i }}
          >
            <div className="hiw-card glass mx-auto max-w-7xl rounded-2xl px-6 py-16 md:px-10 md:py-20">
              <div className="w-10 h-10 mb-5">
                <OrbitIcon />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl">{s.title}</h3>
              <p className="mt-4 text-slate-700 text-lg max-w-2xl">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


