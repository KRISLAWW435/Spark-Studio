// src/components/effects/PaintSplash.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface PaintSplashProps {
  id: number;
  startX?: number;
  startY?: number;
  targetX: number;
  targetY: number;
  controlX: number;
  controlY: number;
  color: string;
  strokeWidth?: number;
  length?: number;
  rotate?: number;
  duration?: number;
  delay?: number;
}

export function PaintSplash({
  targetX,
  targetY,
  controlX,
  controlY,
  color,
  strokeWidth = 12,
  length = 50,
  rotate = 0,
  duration = 0.55,
  delay = 0,
}: PaintSplashProps) {
  // Изогнутый мазок краски через квадратичную кривую Безье
  const pathData = `M -${length / 2} 0 Q ${controlX} ${controlY} ${length / 2} 0`;

  return (
    <motion.g
      initial={{ x: '50%', y: '50%', scale: 0.1, opacity: 1, rotate: 0 }}
      animate={{
        x: `calc(50% + ${targetX}px)`,
        y: `calc(50% + ${targetY}px)`,
        scale: [0.1, 1.25, 0.9],
        opacity: [1, 1, 0],
        rotate,
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      <motion.path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          filter: `drop-shadow(0 0 10px ${color})`,
        }}
      />
    </motion.g>
  );
}

export default PaintSplash;
