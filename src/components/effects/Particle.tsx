// src/components/effects/Particle.tsx
import React from 'react';
import { motion } from 'motion/react';

export type ParticleShape = 'circle' | 'star' | 'diamond' | 'droplet' | 'triangle';

export interface ParticleProps {
  key?: React.Key;
  shape: ParticleShape;
  color: string;
  size: number;
  initialX?: number;
  initialY?: number;
  targetX?: number;
  targetY?: number;
  rotation?: number;
  scale?: number[];
  opacity?: number[];
  duration?: number;
  delay?: number;
  className?: string;
}

export function Particle({
  shape,
  color,
  size,
  initialX = 0,
  initialY = 0,
  targetX = 0,
  targetY = 0,
  rotation = 0,
  scale = [0.2, 1.2, 0.4],
  opacity = [1, 1, 0],
  duration = 0.6,
  delay = 0,
}: ParticleProps) {
  return (
    <motion.g
      initial={{
        x: `calc(50% + ${initialX}px)`,
        y: `calc(50% + ${initialY}px)`,
        scale: scale[0],
        opacity: opacity[0],
        rotate: 0,
      }}
      animate={{
        x: `calc(50% + ${targetX}px)`,
        y: `calc(50% + ${targetY}px)`,
        scale,
        opacity,
        rotate: rotation,
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {shape === 'circle' && (
        <circle r={size / 2} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      )}

      {shape === 'star' && (
        <polygon
          points={`0,-${size} ${size * 0.3},-${size * 0.3} ${size},0 ${size * 0.3},${size * 0.3} 0,${size} -${size * 0.3},${size * 0.3} -${size},0 -${size * 0.3},-${size * 0.3}`}
          fill={color}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      )}

      {shape === 'diamond' && (
        <polygon
          points={`0,-${size * 0.75} ${size * 0.55},0 0,${size * 0.75} -${size * 0.55},0`}
          fill={color}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      )}

      {shape === 'triangle' && (
        <polygon
          points={`0,-${size * 0.6} ${size * 0.6},${size * 0.6} -${size * 0.6},${size * 0.6}`}
          fill={color}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      )}

      {shape === 'droplet' && (
        <path
          d={`M 0 -${size * 0.6} C ${size * 0.4} -${size * 0.2} ${size * 0.4} ${size * 0.4} 0 ${size * 0.5} C -${size * 0.4} ${size * 0.4} -${size * 0.4} -${size * 0.2} 0 -${size * 0.6} Z`}
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      )}
    </motion.g>
  );
}

export default Particle;
