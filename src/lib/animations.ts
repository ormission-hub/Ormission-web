import { Variants, TargetAndTransition } from "framer-motion";

// ============================================================================
// Ormission Design System: 7 Core Modern Animation Presets
// (Scroll Reveal, Zoom In, Zoom In Up, Flip Left, Flip Right, Hover Lift, Staggered)
// ============================================================================

/**
 * 1. Staggered Animation Container
 * Cascades children in sequence with a dynamic delay
 */
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

/**
 * 2. Scroll Reveal Animation
 * Smooth slide-up and fade-in when scrolling into viewport
 */
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * 3. Zoom In Animation
 * Clean scale entrance from 85% to 100%
 */
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * 4. Zoom In Up Animation
 * Scale entrance combined with upward momentum
 */
export const zoomInUp: Variants = {
  hidden: { opacity: 0, scale: 0.86, y: 45 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * 5. Flip Left Animation (3D Perspective)
 * Flips into view from the left along Y axis
 */
export const flipLeft: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -55,
    scale: 0.92,
    transformPerspective: 1000,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformPerspective: 1000,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * 6. Flip Right Animation (3D Perspective)
 * Flips into view from the right along Y axis
 */
export const flipRight: Variants = {
  hidden: {
    opacity: 0,
    rotateY: 55,
    scale: 0.92,
    transformPerspective: 1000,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformPerspective: 1000,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * 7. Hover Lift Effect
 * 3D elevation on mouse hover with smooth scale and soft shadow
 */
export const hoverLiftProps: {
  whileHover: TargetAndTransition;
  whileTap: TargetAndTransition;
} = {
  whileHover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  whileTap: {
    y: -2,
    scale: 0.98,
  },
};

