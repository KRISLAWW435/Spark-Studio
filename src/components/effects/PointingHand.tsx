// src/components/effects/PointingHand.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface PointingHandProps {
  visible: boolean;
}

export function PointingHand({ visible }: PointingHandProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        visible
          ? {
              opacity: 1,
              scale: 1,
              x: [0, 4, 0],
              y: [0, 6, 0],
            }
          : { opacity: 0, scale: 0.8, pointerEvents: 'none' }
      }
      transition={
        visible
          ? {
              opacity: { duration: 0.25 },
              x: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }
          : { duration: 0.2, ease: 'easeOut' }
      }
      className="absolute pointer-events-none z-40 select-none"
      style={{
        // Палец указывает прямо на правый нижний край магического шара
        right: '18px',
        bottom: '18px',
        willChange: 'transform, opacity',
      }}
    >
      {/* Качественный классический курсор-указатель (палец) точно как на референсе */}
      <svg
        width="66"
        height="74"
        viewBox="0 0 66 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-rotate-12"
      >
        <defs>
          <filter id="handCursorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4338CA" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#handCursorGlow)">
          {/* Сплошная белая заливка силуэта руки */}
          <path
            d="
              M 22 4
              C 22 1.8, 25.6 0, 29 0
              C 32.4 0, 36 1.8, 36 4
              L 36 29
              C 37.5 27, 40 26, 43 26
              C 46.5 26, 49 28, 49 31
              C 50.2 29.5, 52.5 28.5, 55 28.5
              C 58.5 28.5, 61 31, 61 34.5
              C 62 33.5, 63.5 33, 65 33
              C 67.5 33, 69.5 35, 69.5 38
              L 69.5 53
              C 69.5 63, 61 71, 50 71
              L 32 71
              C 23 71, 15 64, 11 55
              L 3 40
              C 1.5 37, 2.5 33.5, 5.5 32
              C 8.5 30.5, 12 32, 14 35
              L 22 46
              L 22 4
              Z
            "
            fill="#FFFFFF"
            transform="scale(0.92)"
          />

          {/* Четкий темный контур как у системного курсора на референсе */}
          <path
            d="
              M 22 4
              C 22 1.8, 25.6 0, 29 0
              C 32.4 0, 36 1.8, 36 4
              L 36 29
              C 37.5 27, 40 26, 43 26
              C 46.5 26, 49 28, 49 31
              C 50.2 29.5, 52.5 28.5, 55 28.5
              C 58.5 28.5, 61 31, 61 34.5
              C 62 33.5, 63.5 33, 65 33
              C 67.5 33, 69.5 35, 69.5 38
              L 69.5 53
              C 69.5 63, 61 71, 50 71
              L 32 71
              C 23 71, 15 64, 11 55
              L 3 40
              C 1.5 37, 2.5 33.5, 5.5 32
              C 8.5 30.5, 12 32, 14 35
              L 22 46
              L 22 4
              Z
            "
            stroke="#2E1065"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="scale(0.92)"
          />

          {/* Линии разделения согнутых пальцев */}
          <path
            d="M 33 30 L 33 46 M 45 32 L 45 48 M 56 34 L 56 50"
            stroke="#2E1065"
            strokeWidth="3.2"
            strokeLinecap="round"
            transform="scale(0.92)"
          />
        </g>
      </svg>
    </motion.div>
  );
}

export default PointingHand;
