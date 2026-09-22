// src/components/effects/Shockwave.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface ShockwaveProps {
  active: boolean;
  size?: number;
  duration?: number;
}

export function Shockwave({ active, size = 180, duration = 0.5 }: ShockwaveProps) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      {[0, 1].map((idx) => (
        <motion.div
          key={`shockwave-${idx}`}
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 18, opacity: 0 }}
          transition={{
            duration: duration + idx * 0.1,
            delay: idx * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="rounded-full absolute"
          style={{
            width: size,
            height: size,
            border: '5px solid #EC4899',
            boxShadow:
              '0 0 40px rgba(168, 85, 247, 0.9), 0 0 80px rgba(34, 211, 238, 0.7), inset 0 0 20px rgba(252, 211, 77, 0.8)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

export default Shockwave;
