// src/components/effects/IdleParticles.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export type ParticleType = 'star' | 'drop' | 'diamond' | 'circle';

export interface ParticleItem {
  id: number;
  angle: number;
  radius: number;
  size: number;
  blink: number;
  type: ParticleType;
  color: string;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
}

export interface IdleParticlesProps {
  buttonRadius?: number;
  isHovered: boolean;
}

// Генератор хаотичных частиц со случайными параметрами
const generateParticles = (count: number, radiusMin: number, radiusMax: number): ParticleItem[] => {
  const types: ParticleType[] = ['star', 'drop', 'diamond', 'circle'];
  const colors = ['#A855F7', '#22D3EE', '#FCD34D', '#EC4899'];

  return Array.from({ length: count }, (_, idx) => {
    // 1. Случайный угол
    let angle = Math.random() * 360;

    // Ограничение: нижний сектор (45°..135°, направленный строго вниз в область белой плашки)
    // Если попадает в нижний сектор — перераспределяем угол в бока или наверх
    if (angle > 45 && angle < 135) {
      angle = Math.random() > 0.5 ? 45 - Math.random() * 30 : 135 + Math.random() * 30;
    }

    // 2. Случайный радиус
    let radius = radiusMin + Math.random() * (radiusMax - radiusMin);

    // 3. Случайные смещения ±30px (размах 60px)
    const offsetX = (Math.random() - 0.5) * 60;
    let offsetY = (Math.random() - 0.5) * 60;

    // Вычисляем координаты
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * radius + offsetX;
    let y = Math.sin(rad) * radius + offsetY;

    // Гарантируем, что частица не опускается в нижние 30% экрана / область белой плашки
    const maxAllowedY = radiusMin * 0.3;
    if (y > maxAllowedY) {
      y = maxAllowedY - Math.random() * 15;
    }

    return {
      id: idx + 1,
      angle,
      radius,
      size: 8 + Math.random() * 16,
      blink: 1.5 + Math.random() * 1.5,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      offsetX,
      offsetY,
      x,
      y,
    };
  });
};

export function IdleParticles({ isHovered }: IdleParticlesProps) {
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const createConfiguredParticles = () => {
      const w = window.innerWidth;
      let count = 15;
      let radiusMin = 160;
      let radiusMax = 260;

      if (w < 768) {
        // Mobile: 8 частиц, радиус 100–180px
        count = 8;
        radiusMin = 100;
        radiusMax = 180;
      } else if (w < 1280) {
        // Tablet: 12 частиц, радиус 130–220px
        count = 12;
        radiusMin = 130;
        radiusMax = 220;
      } else {
        // Desktop: 15 частиц, радиус 160–260px
        count = 15;
        radiusMin = 160;
        radiusMax = 260;
      }

      setParticles(generateParticles(count, radiusMin, radiusMax));
    };

    createConfiguredParticles();
    window.addEventListener('resize', createConfiguredParticles);
    return () => window.removeEventListener('resize', createConfiguredParticles);
  }, []);

  return (
    // Слой z-10: строго под кнопкой (z-15) и белой плашкой (z-20)
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            x: p.x,
            y: p.y,
            willChange: 'transform, opacity',
          }}
          animate={
            isHovered
              ? {
                  scale: [1, 1.25, 1],
                  opacity: [0.65, 1, 0.65],
                }
              : {
                  scale: [0.85, 1.1, 0.85],
                  opacity: [0.35, 0.95, 0.35],
                }
          }
          transition={{
            duration: p.blink,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (p.id % 4) * 0.25,
          }}
        >
          {/* 1. Звезда 4-лучевая */}
          {p.type === 'star' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              className="overflow-visible"
            >
              <path
                d="M 12 0 Q 12 9 3 12 Q 12 15 12 24 Q 12 15 21 12 Q 12 9 12 0 Z"
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
              />
            </svg>
          )}

          {/* 2. Капля / мазок краски */}
          {p.type === 'drop' && (
            <svg
              width={p.size}
              height={Math.round(p.size * 1.25)}
              viewBox="0 0 20 25"
              className="overflow-visible"
            >
              <path
                d="M 10 2 C 10 2 2 12 2 17 C 2 21.4 5.6 25 10 25 C 14.4 25 18 21.4 18 17 C 18 12 10 2 10 2 Z"
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 5px ${p.color}99)` }}
              />
            </svg>
          )}

          {/* 3. Ромб / кристалл */}
          {p.type === 'diamond' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 20 20"
              className="overflow-visible"
            >
              <polygon
                points="10,1 19,10 10,19 1,10"
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 5px ${p.color}99)` }}
              />
            </svg>
          )}

          {/* 4. Круг / сияющая точка */}
          {p.type === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default IdleParticles;
