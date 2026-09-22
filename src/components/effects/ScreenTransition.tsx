// src/components/effects/ScreenTransition.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface ScreenTransitionProps {
  active: boolean;
  duration?: number;
}

export function ScreenTransition({ active, duration = 0.5 }: ScreenTransitionProps) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: 'easeInOut' }}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: 'linear-gradient(135deg, #DCE9FF 0%, #E8E0FF 50%, #F5E0F0 100%)',
      }}
    />
  );
}

export default ScreenTransition;
