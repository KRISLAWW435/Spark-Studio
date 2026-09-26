// src/components/effects/MagicButton.tsx
import React from 'react';
import { motion } from 'motion/react';

export interface MagicButtonProps {
  phase: 'idle' | 'press' | 'burst' | 'transition';
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
  size?: number;
  sparklesSize?: number;
}

export function MagicButton({
  phase,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
  size = 220,
  sparklesSize = 90,
}: MagicButtonProps) {
  return (
    <motion.div
      className="group relative flex items-center justify-center cursor-pointer select-none outline-none z-[15] rounded-full border-2 sm:border-4 border-cyan-400/90 shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:shadow-[0_0_35px_rgba(34,211,238,0.85)] hover:border-cyan-300 transition-all duration-300"
      style={{
        width: size,
        height: size,
        willChange: 'transform, opacity',
      }}
      animate={
        phase === 'idle'
          ? {
              scale: isHovered ? 1.08 : [1, 1.05, 1],
            }
          : phase === 'press'
          ? { scale: 0.93 }
          : { scale: [0.93, 2.2], opacity: [1, 0] }
      }
      transition={
        phase === 'idle'
          ? isHovered
            ? { duration: 0.25, ease: 'easeOut' }
            : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          : phase === 'press'
          ? { duration: 0.14, ease: 'easeOut' }
          : { duration: 0.35, ease: 'easeOut' }
      }
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
    >
      {/* 1. Пастельная световая аура вокруг 3D-шара */}
      <motion.div
        className="absolute -inset-8 rounded-full pointer-events-none"
        animate={{
          scale: isHovered ? [1.08, 1.15, 1.08] : [1, 1.06, 1],
          opacity: isHovered ? 0.85 : [0.5, 0.7, 0.5],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
        }}
        style={{
          background:
            'radial-gradient(circle, rgba(224, 231, 255, 0.6) 20%, rgba(243, 232, 255, 0.5) 45%, rgba(254, 240, 250, 0.3) 65%, rgba(255, 255, 255, 0) 80%)',
        }}
      />

      {/* 2. Концентрические световые кольца при клике */}
      {phase === 'press' && (
        <>
          <motion.div
            className="absolute -inset-8 rounded-full border-2 border-cyan-300/80 pointer-events-none"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute -inset-14 rounded-full border-2 border-fuchsia-300/70 pointer-events-none"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 1.65, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          />
        </>
      )}

      {/* 3. Реалистичный объемный 3D-шар со множеством светлых бликов и чисто белой звездой */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible pointer-events-none drop-shadow-[0_14px_30px_rgba(99,102,241,0.25)]"
        style={{ willChange: 'transform' }}
      >
        <defs>
          {/* Стеклянный обод: 3D глубина сферы */}
          <linearGradient id="glassRimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="25%" stopColor="#0284C7" />
            <stop offset="55%" stopColor="#6366F1" />
            <stop offset="80%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>

          {/* 3D объем сферического тела (свет падает сверху-слева) */}
          <radialGradient id="sphere3DGradient" cx="34%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="16%" stopColor="#60A5FA" />
            <stop offset="38%" stopColor="#2563EB" />
            <stop offset="68%" stopColor="#4338CA" />
            <stop offset="88%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A855F7" />
          </radialGradient>

          {/* Яркий белый главный стеклянный блик (крупный серп сверху-слева) */}
          <linearGradient id="primaryGleam" x1="0%" y1="0%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#BAE6FD" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>

          {/* Вторичный яркий дуговой блик по верхнему контуру */}
          <linearGradient id="topArcHighlight" x1="20%" y1="0%" x2="80%" y2="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Светлый контурный блик стекла по нижнему ободу */}
          <linearGradient id="bottomRimGleam" x1="20%" y1="100%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Правый боковой светлый рефлекс */}
          <linearGradient id="rightRimGleam" x1="100%" y1="20%" x2="70%" y2="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#F472B6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>

          {/* Сочный неоново-малиновый рефлекс снизу */}
          <radialGradient id="bottomPinkReflex" cx="48%" cy="90%" r="48%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#EC4899" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#C084FC" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </radialGradient>

          {/* Белое сияние вокруг чистой белой звезды */}
          <radialGradient id="starWhiteAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#E0E7FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Внешний обод 3D сферы */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#glassRimGradient)"
          opacity="0.9"
        />

        {/* 2. Объемное 3D тело сферы */}
        <circle
          cx="100"
          cy="100"
          r="89"
          fill="url(#sphere3DGradient)"
        />

        {/* 3. Нижний яркий малиновый рефлекс (объемная подсветка) */}
        <circle
          cx="100"
          cy="100"
          r="89"
          fill="url(#bottomPinkReflex)"
        />

        {/* 4. Верхний светлый дуговой блик (вдоль кромки) */}
        <path
          d="M 36 65 C 44 38, 70 20, 102 18 C 126 17, 148 24, 164 38 C 146 28, 124 23, 100 24 C 68 25, 46 42, 36 65 Z"
          fill="url(#topArcHighlight)"
        />

        {/* 5. Главный изогнутый 3D-блик (глянцевое выпуклое стекло) */}
        <path
          d="M 28 85 C 30 52, 54 26, 92 20 C 122 15, 150 26, 166 45 C 150 32, 122 26, 95 30 C 58 35, 36 56, 28 85 Z"
          fill="url(#primaryGleam)"
        />

        {/* 6. Большой точечный зеркальный блик на вершине сферы */}
        <ellipse
          cx="52"
          cy="46"
          rx="14"
          ry="7"
          transform="rotate(-38 52 46)"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* 7. Малый микро-блик рядом */}
        <circle
          cx="72"
          cy="36"
          r="4.5"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* 8. Правый боковой светлый рефлекс стекла */}
        <path
          d="M 166 60 C 178 85, 180 115, 170 142 C 176 122, 175 92, 164 72 Z"
          fill="url(#rightRimGleam)"
        />

        {/* 9. Нижний светлый ободковый блик */}
        <path
          d="M 54 166 C 82 184, 122 184, 152 162 C 132 176, 98 178, 68 166 Z"
          fill="url(#bottomRimGleam)"
        />

        {/* 10. Дополнительный стеклянный светлый штрих снизу-справа */}
        <ellipse
          cx="145"
          cy="148"
          rx="12"
          ry="4"
          transform="rotate(-40 145 148)"
          fill="#FFFFFF"
          opacity="0.6"
        />

        {/* 11. ЦЕНТРАЛЬНАЯ ЧИСТО БЕЛАЯ ЗВЕЗДА (БЕЗ ЖЕЛТОЙ ОБВОДКИ) */}
        <g transform={`translate(100, 100) scale(${sparklesSize / 90})`}>
          {/* Мягкий чисто белый ореол */}
          <circle r="44" fill="url(#starWhiteAura)" />

          <motion.g
            animate={
              isHovered
                ? { scale: [1, 1.1, 1] }
                : { scale: [0.98, 1.02, 0.98] }
            }
            transition={{
              duration: isHovered ? 1.4 : 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Ослепительно белая 4-лучевая звезда с мягким сиянием */}
            <path
              d="M 0 -48 Q 0 -9, -38 0 Q -9 0, 0 48 Q 0 9, 38 0 Q 9 0, 0 -48 Z"
              fill="#FFFFFF"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))',
              }}
            />

            {/* Яркая белая сердцевина */}
            <circle r="6" fill="#FFFFFF" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}

export default MagicButton;
