// Global animation configuration and reusable motion variants

export const motionConfig = {
  // Transition timing
  transitions: {
    fast: { duration: 0.15 },
    normal: { duration: 0.25 },
    slow: { duration: 0.4 },
    reveal: { duration: 0.6 },
  },
};

// Page entrance animations
export const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Welcome page hero animations
export const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

// Button animations
export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.96 },
};

// Card animations
export const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, type: "easeOut" },
  },
  hover: { y: -4, transition: { duration: 0.2 } },
};

// Modal/Overlay animations
export const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } },
};

// List animations (e.g., player lists, chat)
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// Stagger animation for buttons/inputs
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Timer/countdown animations
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const criticalPulseVariants = {
  animate: {
    scale: [1, 1.08, 1],
    boxShadow: [
      "0 0 0 0 rgba(239, 68, 68, 0.7)",
      "0 0 0 12px rgba(239, 68, 68, 0)",
    ],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

// User highlight
export const highlightVariants = {
  active: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderColor: "rgb(168, 85, 247)",
    transition: { duration: 0.2 },
  },
  inactive: {
    backgroundColor: "transparent",
    borderColor: "rgba(107, 114, 128, 0.5)",
    transition: { duration: 0.2 },
  },
};

// Loading skeleton animations
export const skeletonVariants = {
  animate: {
    backgroundPosition: ["200% 0%", "-200% 0%"],
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
};

// Chat bubble animation
export const chatBubbleVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
};

// Code diff highlight animation
export const diffHighlightVariants = {
  added: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    transition: { duration: 0.3 },
  },
  removed: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    transition: { duration: 0.3 },
  },
};

// Phase transition overlay
export const phaseOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Timer warning (low time left)
export const warningVariants = {
  animate: {
    textShadow: [
      "0 0 0px rgba(239, 68, 68, 0.5)",
      "0 0 10px rgba(239, 68, 68, 0.8)",
      "0 0 0px rgba(239, 68, 68, 0.5)",
    ],
    transition: { duration: 1.5, repeat: Infinity },
  },
};
