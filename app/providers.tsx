"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const transition = {
    duration: prefersReduced ? 0 : 0.5,
    ease: [0.22, 1, 0.36, 1], // cubic-bezier(0.22,1,0.36,1) for a soft ease
  } as const;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


