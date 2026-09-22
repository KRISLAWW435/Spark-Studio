// src/components/effects/MagicPortal.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface MagicPortalProps {
  phase: 'idle' | 'press' | 'burst' | 'portal' | 'transition';
  size?: number;
}

export function MagicPortal({ phase, size = 320 }: MagicPortalProps) {
  if (phase !== 'portal' && phase !== 'transition') return null;

  return (
    <motion.div
      initial={{ scale: 0.4, rotate: 0, opacity: 0 }}
      animate={
        phase === 'portal'
          ? {
              scale: [0.4, 1.5],
              rotate: 720,
              opacity: 1,
            }
          : {
              scale: [1.5, 9],
              rotate: 1080,
              opacity: [1, 0.95, 0],
            }
      }
      transition={{
        duration: phase === 'portal' ? 0.65 : 0.8,
        ease: phase === 'portal' ? 'easeInOut' : [0.25, 1, 0.5, 1],
      }}
      className="absolute flex items-center justify-center rounded-full pointer-events-none z-40"
      style={{
        width: size,
        height: size,
        willChange: 'transform, opacity',
      }}
    >
      {/* 1. Внешнее радужное вихревое кольцо из мазков */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, #A855F7, #3B82F6, #22D3EE, #EC4899, #FCD34D, #FB923C, #A855F7)',
          maskImage: 'radial-gradient(circle, transparent 46%, black 50%, black 95%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle, transparent 46%, black 50%, black 95%, transparent 100%)',
          filter: 'drop-shadow(0 0 35px rgba(168, 85, 247, 0.85))',
        }}
      />

      {/* 2. Второе концентрическое кольцо (противовращение) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[82%] h-[82%] rounded-full"
        style={{
          background:
            'conic-gradient(from 180deg, #22D3EE, #EC4899, #FCD34D, #A855F7, #3B82F6, #22D3EE)',
          maskImage: 'radial-gradient(circle, transparent 44%, black 50%, black 95%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle, transparent 44%, black 50%, black 95%, transparent 100%)',
          filter: 'drop-shadow(0 0 25px rgba(34, 211, 238, 0.8))',
        }}
      />

      {/* 3. Внутреннее светящееся ядро портала (вход в следующий мир) */}
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: [0.7, 1.1, 0.95] }}
        transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
        className="w-[62%] h-[62%] rounded-full flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle, #FFFFFF 0%, #FDE047 25%, #EC4899 55%, #3B82F6 85%, transparent 100%)',
          boxShadow:
            '0 0 90px rgba(255, 255, 255, 1), 0 0 160px rgba(34, 211, 238, 0.9), inset 0 0 50px #FFF',
        }}
      />
    </motion.div>
  );
}

export default MagicPortal;
