// src/components/effects/ParticleBurst.tsx
import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface SplatTentacle {
  id: number;
  path: string;
  targetX: number;
  targetY: number;
  rotation: number;
  scale: number;
  gradientId: string;
  duration: number;
  delay: number;
}

interface FlyingOrb {
  id: number;
  color: string;
  size: number;
  targetX: number;
  targetY: number;
  type: 'orb' | 'star';
  duration: number;
  delay: number;
}

export interface ParticleBurstProps {
  active: boolean;
}

export function ParticleBurst({ active }: ParticleBurstProps) {
  // Крупные динамичные щупальца краски (как на панели 3 референса)
  const tentacles = useMemo<SplatTentacle[]>(() => {
    return [
      // Верхнее правое щупальце
      {
        id: 1,
        path: 'M0 0 C 15 -60, 45 -140, 75 -220 C 65 -180, 20 -100, 0 0 Z',
        targetX: 55,
        targetY: -90,
        rotation: 20,
        scale: 1.2,
        gradientId: 'burstGradBluePurpleYellow',
        duration: 0.45,
        delay: 0,
      },
      // Верхнее левое щупальце
      {
        id: 2,
        path: 'M0 0 C -25 -50, -50 -130, -90 -190 C -60 -140, -25 -70, 0 0 Z',
        targetX: -60,
        targetY: -80,
        rotation: -25,
        scale: 1.15,
        gradientId: 'burstGradYellowPinkPurple',
        duration: 0.45,
        delay: 0.02,
      },
      // Правое широкое щупальце
      {
        id: 3,
        path: 'M0 0 C 60 -10, 140 30, 210 20 C 160 50, 80 30, 0 0 Z',
        targetX: 90,
        targetY: 15,
        rotation: 10,
        scale: 1.25,
        gradientId: 'burstGradCyanBluePurple',
        duration: 0.48,
        delay: 0.01,
      },
      // Левое нижнее крупное щупальце
      {
        id: 4,
        path: 'M0 0 C -60 20, -140 60, -200 120 C -150 70, -70 40, 0 0 Z',
        targetX: -85,
        targetY: 60,
        rotation: -15,
        scale: 1.2,
        gradientId: 'burstGradBluePurpleCyan',
        duration: 0.46,
        delay: 0.02,
      },
      // Нижнее правое щупальце
      {
        id: 5,
        path: 'M0 0 C 40 50, 90 120, 130 200 C 90 150, 40 80, 0 0 Z',
        targetX: 65,
        targetY: 85,
        rotation: 30,
        scale: 1.1,
        gradientId: 'burstGradPurpleMagentaYellow',
        duration: 0.47,
        delay: 0.03,
      },
      // Левое верхнее горизонтальное
      {
        id: 6,
        path: 'M0 0 C -50 -30, -120 -50, -190 -60 C -140 -40, -70 -20, 0 0 Z',
        targetX: -80,
        targetY: -35,
        rotation: 5,
        scale: 1.05,
        gradientId: 'burstGradCyanBluePurple',
        duration: 0.44,
        delay: 0.01,
      },
      // Нижнее каплевидное
      {
        id: 7,
        path: 'M0 0 C -10 60, -20 130, -30 190 C -5 130, 10 70, 0 0 Z',
        targetX: -15,
        targetY: 90,
        rotation: -10,
        scale: 1.0,
        gradientId: 'burstGradYellowPinkPurple',
        duration: 0.45,
        delay: 0.04,
      },
    ];
  }, []);

  // Летающие бусины и звезды
  const flyingElements = useMemo<FlyingOrb[]>(() => {
    return [
      { id: 1, color: '#FBBF24', size: 28, targetX: 85, targetY: -130, type: 'orb', duration: 0.48, delay: 0.02 },
      { id: 2, color: '#FBBF24', size: 34, targetX: 130, targetY: -75, type: 'star', duration: 0.5, delay: 0.03 },
      { id: 3, color: '#FBBF24', size: 32, targetX: -8, targetY: 140, type: 'star', duration: 0.49, delay: 0.01 },
      { id: 4, color: '#06B6D4', size: 22, targetX: -140, targetY: -95, type: 'orb', duration: 0.46, delay: 0.01 },
      { id: 5, color: '#3B82F6', size: 20, targetX: -130, targetY: 25, type: 'orb', duration: 0.47, delay: 0.02 },
      { id: 6, color: '#8B5CF6', size: 24, targetX: -95, targetY: -135, type: 'orb', duration: 0.45, delay: 0.03 },
      { id: 7, color: '#EC4899', size: 18, targetX: 145, targetY: -20, type: 'orb', duration: 0.46, delay: 0.04 },
      { id: 8, color: '#06B6D4', size: 22, targetX: 155, targetY: 55, type: 'orb', duration: 0.48, delay: 0.02 },
      { id: 9, color: '#FBBF24', size: 24, targetX: -130, targetY: -15, type: 'star', duration: 0.47, delay: 0.03 },
      { id: 10, color: '#D946EF', size: 22, targetX: 55, targetY: 165, type: 'orb', duration: 0.5, delay: 0.02 },
    ];
  }, []);

  if (!active) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-30"
      style={{ willChange: 'transform' }}
    >
      <defs>
        {/* Градиенты выплеска краски (синий -> фиолетовый -> желтый) */}
        <linearGradient id="burstGradBluePurpleYellow" x1="0%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="45%" stopColor="#A855F7" />
          <stop offset="80%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        <linearGradient id="burstGradYellowPinkPurple" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="40%" stopColor="#EC4899" />
          <stop offset="85%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>

        <linearGradient id="burstGradCyanBluePurple" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="80%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>

        <linearGradient id="burstGradPurpleMagentaYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#EC4899" />
          <stop offset="90%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>

        <linearGradient id="burstGradBluePurpleCyan" x1="50%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="85%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#67E8F9" />
        </linearGradient>
      </defs>

      {/* 1. Мощные выплески-щупальца краски */}
      {tentacles.map((t) => (
        <motion.g
          key={`tentacle-${t.id}`}
          initial={{ x: '50%', y: '50%', scale: 0.1, opacity: 1, rotate: 0 }}
          animate={{
            x: `calc(50% + ${t.targetX}px)`,
            y: `calc(50% + ${t.targetY}px)`,
            scale: [0.1, t.scale * 1.25, t.scale],
            opacity: [1, 1, 0],
            rotate: t.rotation,
          }}
          transition={{
            duration: t.duration,
            delay: t.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <path d={t.path} fill={`url(#${t.gradientId})`} />
        </motion.g>
      ))}

      {/* 2. Центральная сверхяркая вспышка-звезда (панель 3) */}
      <motion.g
        initial={{ x: '50%', y: '50%', scale: 0.2, opacity: 1 }}
        animate={{
          x: '50%',
          y: '50%',
          scale: [0.2, 1.8, 0],
          opacity: [1, 1, 0],
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <polygon
          points="0,-120 18,-45 75,-85 38,-20 120,-15 48,15 90,75 22,40 0,120 -22,40 -90,75 -48,15 -120,-15 -38,-20 -75,-85 -18,-45"
          fill="#FFFFFF"
          stroke="#FCD34D"
          strokeWidth="6"
        />
        <polygon
          points="0,-85 14,-30 55,-60 28,-14 85,-10 35,10 65,55 16,28 0,85 -16,28 -65,55 -35,10 -85,-10 -28,-14 -55,-60 -14,-30"
          fill="#FEF08A"
        />
        <circle r="40" fill="#FFFFFF" />
      </motion.g>

      {/* 3. Вылетающие шарики и золотые звезды */}
      {flyingElements.map((el) => (
        <motion.g
          key={`flying-${el.id}`}
          initial={{ x: '50%', y: '50%', scale: 0.2, opacity: 1 }}
          animate={{
            x: `calc(50% + ${el.targetX}px)`,
            y: `calc(50% + ${el.targetY}px)`,
            scale: [0.2, 1.25, 0.5],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {el.type === 'star' ? (
            <path
              d="M0 -20 Q0 -7 -20 0 Q-7 0 0 20 Q0 7 20 0 Q7 0 0 -20 Z"
              fill={el.color}
            />
          ) : (
            <g>
              <circle r={el.size / 2} fill={el.color} />
              <ellipse
                cx={-el.size * 0.15}
                cy={-el.size * 0.15}
                rx={el.size * 0.15}
                ry={el.size * 0.08}
                fill="#FFFFFF"
                opacity="0.85"
              />
            </g>
          )}
        </motion.g>
      ))}
    </svg>
  );
}

export default ParticleBurst;
