// src/components/effects/IdleParticles.tsx
import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface MagicSparkle {
  id: number;
  type: 'gold-star' | 'paint-swish' | 'bead-drop' | 'diamond' | 'mini-spark';
  angle: number;
  distance: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
}

export interface IdleParticlesProps {
  buttonRadius?: number;
  isHovered: boolean;
}

export function IdleParticles({ buttonRadius = 95, isHovered }: IdleParticlesProps) {
  // Элементы точно как на референсе: золотые звезды, мазки краски, капли-бусины и кристаллы
  const sparkles = useMemo<MagicSparkle[]>(() => {
    return [
      // Крупная золотая звезда сверху
      { id: 1, type: 'gold-star', angle: -90, distance: buttonRadius + 58, color: '#FBBF24', size: 28, rotation: 0, duration: 3.2, delay: 0 },
      // Золотая звезда слева
      { id: 2, type: 'gold-star', angle: 175, distance: buttonRadius + 65, color: '#FBBF24', size: 22, rotation: 12, duration: 3.6, delay: 0.4 },
      // Золотая звезда справа-снизу
      { id: 3, type: 'gold-star', angle: 42, distance: buttonRadius + 60, color: '#FBBF24', size: 20, rotation: -8, duration: 3.0, delay: 0.8 },
      // Золотая звезда внизу
      { id: 4, type: 'gold-star', angle: 85, distance: buttonRadius + 54, color: '#FBBF24', size: 18, rotation: 5, duration: 3.4, delay: 1.2 },

      // Изогнутый мазок краски (сверху-слева, лазурный)
      { id: 5, type: 'paint-swish', angle: -140, distance: buttonRadius + 52, color: '#06B6D4', size: 24, rotation: -40, duration: 4.0, delay: 0.2 },
      // Мазок краски (справа, фиолетовый)
      { id: 6, type: 'paint-swish', angle: 10, distance: buttonRadius + 56, color: '#D946EF', size: 22, rotation: 35, duration: 3.8, delay: 0.6 },
      // Мазок краски (сверху-справа, синий)
      { id: 7, type: 'paint-swish', angle: -45, distance: buttonRadius + 68, color: '#3B82F6', size: 20, rotation: 65, duration: 4.2, delay: 1.0 },

      // Капли-бусины краски (как на референсе: лазурная, розовая, фиолетовая)
      { id: 8, type: 'bead-drop', angle: -115, distance: buttonRadius + 62, color: '#8B5CF6', size: 14, rotation: 0, duration: 2.8, delay: 0.3 },
      { id: 9, type: 'bead-drop', angle: 140, distance: buttonRadius + 50, color: '#06B6D4', size: 15, rotation: 0, duration: 3.0, delay: 0.7 },
      { id: 10, type: 'bead-drop', angle: -25, distance: buttonRadius + 52, color: '#0EA5E9', size: 16, rotation: 0, duration: 3.2, delay: 0.1 },
      { id: 11, type: 'bead-drop', angle: -70, distance: buttonRadius + 68, color: '#C084FC', size: 12, rotation: 0, duration: 3.5, delay: 0.9 },

      // Синие и фиолетовые кристаллы/звездочки
      { id: 12, type: 'diamond', angle: -160, distance: buttonRadius + 58, color: '#6366F1', size: 16, rotation: 15, duration: 3.1, delay: 0.5 },
      { id: 13, type: 'diamond', angle: 65, distance: buttonRadius + 66, color: '#3B82F6', size: 16, rotation: -10, duration: 3.3, delay: 0.4 },
      { id: 14, type: 'mini-spark', angle: -30, distance: buttonRadius + 38, color: '#38BDF8', size: 8, rotation: 0, duration: 2.2, delay: 0.2 },
      { id: 15, type: 'mini-spark', angle: 115, distance: buttonRadius + 44, color: '#E879F9', size: 9, rotation: 0, duration: 2.4, delay: 0.6 },
    ];
  }, [buttonRadius]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {sparkles.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = Math.cos(rad) * s.distance;
        const y = Math.sin(rad) * s.distance;

        return (
          <motion.div
            key={`sparkle-${s.id}`}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              x,
              y,
              willChange: 'transform, opacity',
            }}
            animate={
              isHovered
                ? {
                    x: [x - 3, x + 3, x - 3],
                    y: [y - 4, y + 4, y - 4],
                    scale: [1.05, 1.25, 1.05],
                    opacity: [0.85, 1, 0.85],
                  }
                : {
                    x: [x - 2, x + 2, x - 2],
                    y: [y - 3, y + 3, y - 3],
                    scale: [0.95, 1.05, 0.95],
                    opacity: [0.8, 1, 0.8],
                  }
            }
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* 1. Золотая 4-лучевая звезда */}
            {s.type === 'gold-star' && (
              <svg width={s.size} height={s.size} viewBox="0 0 32 32" className="overflow-visible">
                <defs>
                  <radialGradient id={`goldGrad-${s.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#FEF08A" />
                    <stop offset="75%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </radialGradient>
                </defs>
                <path
                  d="M16 0 Q16 12 4 16 Q16 20 16 32 Q16 20 28 16 Q16 12 16 0 Z"
                  fill={`url(#goldGrad-${s.id})`}
                  transform={`rotate(${s.rotation} 16 16)`}
                  filter="drop-shadow(0 2px 8px rgba(251, 191, 36, 0.4))"
                />
              </svg>
            )}

            {/* 2. Изогнутый мазок краски (swish) */}
            {s.type === 'paint-swish' && (
              <svg width={s.size} height={s.size} viewBox="0 0 32 32" className="overflow-visible">
                <path
                  d="M 4 24 Q 10 4 28 8 Q 18 16 14 26 Z"
                  fill={s.color}
                  transform={`rotate(${s.rotation} 16 16)`}
                  opacity="0.9"
                />
              </svg>
            )}

            {/* 3. Капли краски с объемом */}
            {s.type === 'bead-drop' && (
              <div
                className="rounded-full relative"
                style={{
                  width: s.size,
                  height: s.size,
                  background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${s.color} 65%)`,
                }}
              >
                <div className="absolute top-1 left-1 w-1 h-0.5 rounded-full bg-white opacity-85" />
              </div>
            )}

            {/* 4. Кристаллы / синие звездочки */}
            {s.type === 'diamond' && (
              <svg width={s.size} height={s.size} viewBox="0 0 24 24">
                <path
                  d="M12 0 Q12 9 3 12 Q12 15 12 24 Q12 15 21 12 Q12 9 12 0 Z"
                  fill={s.color}
                  transform={`rotate(${s.rotation} 12 12)`}
                />
              </svg>
            )}

            {/* 5. Микро-искра */}
            {s.type === 'mini-spark' && (
              <div
                className="rounded-full"
                style={{
                  width: s.size,
                  height: s.size,
                  backgroundColor: s.color,
                  opacity: 0.85,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default IdleParticles;
