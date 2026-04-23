import type { Variants, Transition } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   SHARED TRANSITIONS
   ────────────────────────────────────────────────────────── */

export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

/* ──────────────────────────────────────────────────────────
   CONTAINER / STAGGER
   ────────────────────────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/* ──────────────────────────────────────────────────────────
   ITEM VARIANTS
   ────────────────────────────────────────────────────────── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: smoothTransition,
  },
};

/* ──────────────────────────────────────────────────────────
   HOVER
   ────────────────────────────────────────────────────────── */

export const hoverLift = {
  whileHover: { y: -6, transition: { duration: 0.25 } },
};

export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.25 } },
  whileTap: { scale: 0.97 },
};

/* ──────────────────────────────────────────────────────────
   FLOATING ELEMENTS
   ────────────────────────────────────────────────────────── */

export const floatingBubble = (delay: number = 0): Variants => ({
  initial: { y: 0, opacity: 0.3 },
  animate: {
    y: [-10, 10, -10],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 5 + delay * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  },
});
