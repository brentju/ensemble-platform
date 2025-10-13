"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HorizontalFeatures() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;
    if (!container || !track || !firstGroup) return;

    const ctx = gsap.context(() => {
      // px per second speed; tuned for a cinematic glide
      const PIXELS_PER_SECOND = 80;
      let tween: gsap.core.Tween | null = null;

      const build = () => {
        const width = firstGroup.offsetWidth; // width of one full set
        if (width <= 0) return;
        if (tween) tween.kill();
        gsap.set(track, { x: 0 });
        tween = gsap.to(track, {
          x: -width,
          duration: width / PIXELS_PER_SECOND,
          ease: "none",
          repeat: -1,
        });
      };

      build();
      const onResize = () => build();
      window.addEventListener("resize", onResize);

      // Pause on hover for interaction
      const pause = () => tween && tween.pause();
      const play = () => tween && tween.play();
      container.addEventListener("mouseenter", pause);
      container.addEventListener("mouseleave", play);

      return () => {
        window.removeEventListener("resize", onResize);
        container.removeEventListener("mouseenter", pause);
        container.removeEventListener("mouseleave", play);
        if (tween) tween.kill();
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const features = [
    "Qualitative & Quantitative Feedback",
    "CI/CD Integration",
    "Autonomous Navigation",
    "PRD Comparison",
    "Stanford HCI Research-Backed",
  ];

  return (
    <section id="features" className="relative w-full bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-serif text-3xl md:text-4xl mb-8">Features</h2>
      </div>
      <div ref={containerRef} className="relative w-full overflow-hidden">
        {/* Edge fades for a cinematic slider feel */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-offwhite to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-offwhite to-transparent z-10" />

        <div ref={trackRef} className="flex gap-6 px-6 py-4 will-change-transform select-none">
          {/* Group A */}
          <div ref={firstGroupRef} className="flex gap-6">
            {features.map((f) => (
              <div
                key={`A-${f}`}
                data-feature-card
                className="glass rounded-2xl p-6 min-w-[280px] md:min-w-[360px] lg:min-w-[420px] bg-white/30 elevate transition-shadow transition-transform duration-300 ease-out will-change-transform hover:scale-[1.02] hover:-translate-y-0.5 hover:ring-2 hover:ring-tan-300/70"
              >
                <p className="text-slate-800 text-lg">{f}</p>
              </div>
            ))}
          </div>
          {/* Group B (duplicate) */}
          <div aria-hidden className="flex gap-6">
            {features.map((f) => (
              <div
                key={`B-${f}`}
                data-feature-card
                className="glass rounded-2xl p-6 min-w-[280px] md:min-w-[360px] lg:min-w-[420px] bg-white/30 elevate transition-shadow transition-transform duration-300 ease-out will-change-transform hover:scale-[1.02] hover:-translate-y-0.5 hover:ring-2 hover:ring-tan-300/70"
              >
                <p className="text-slate-800 text-lg">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


