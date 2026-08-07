'use client';

import { ReactNode } from 'react';
import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';

/** Apple-ish spring easing used across the app. */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/**
 * Simple fade-up wrapper (backward compatible with existing callers).
 * Optional `delay` staggers it after siblings.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — children using <StaggerItem> animate in sequence.
 * Drop it around a list/grid and it orchestrates the entrance.
 */
export function Stagger({
  children,
  className,
  gap = 0.07,
  delayChildren = 0.04,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delayChildren?: number;
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const container: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: gap, delayChildren } },
  };
  return (
    <motion.div className={className} variants={container} initial="initial" animate="animate" {...rest}>
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  return (
    <motion.div className={className} variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}

/**
 * Scroll-triggered reveal. Animates once when it scrolls into view — used for
 * long marketing pages where entrance-on-mount would fire off-screen.
 */
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
