'use client';

import { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
