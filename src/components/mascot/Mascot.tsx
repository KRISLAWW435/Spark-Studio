// src/components/mascot/Mascot.tsx
import React from 'react';
import { motion } from 'motion/react';

export type MascotMood = 'idle' | 'happy' | 'pointing' | 'thinking' | 'success' | 'locked';

interface MascotProps {
  mood?: MascotMood;
  onClick?: () => void;
  className?: string;
  size?: number;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  onClick,
  className = '',
  size = 210
}) => {
  // Анимационные вариации в зависимости от состояния (без translate и rotate)
  const getVariants = () => {
    switch (mood) {
      case 'happy':
      case 'success':
        return {
          animate: {
            scale: [1, 1.05, 1],
            transition: { duration: 0.5, ease: 'easeInOut' }
          }
        };
      case 'pointing':
        return {
          animate: {
            scale: 1.03,
            transition: { duration: 0.3 }
          }
        };
      case 'locked':
        return {
          animate: {
            scale: [1, 0.97, 1],
            transition: { duration: 0.4 }
          }
        };
      case 'thinking':
        return {
          animate: {
            scale: 1.02,
            transition: { duration: 0.4 }
          }
        };
      case 'idle':
      default:
        return {
          animate: {
            scale: 1
          }
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      className={`relative select-none cursor-pointer flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.1}px` }}
      onClick={onClick}
      animate={variants.animate}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      id="game-mascot"
    >
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full filter drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Градиент основного тела пламени */}
          <linearGradient id="mascotFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="25%" stopColor="#FFB300" />
            <stop offset="60%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#E64A19" />
          </linearGradient>

          {/* Внутреннее золотистое ядро пламени */}
          <linearGradient id="mascotCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF59D" />
            <stop offset="85%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFB74D" />
          </linearGradient>

          {/* Румянец */}
          <radialGradient id="blushGrad">
            <stop offset="0%" stopColor="#FF5252" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Энергетические искры-штрихи вокруг головы (как на референсе \ | /) */}
        <g stroke="#FF7A00" strokeWidth="5" strokeLinecap="round">
          <line x1="28" y1="62" x2="16" y2="58" />
          <line x1="25" y1="84" x2="12" y2="88" />
          <line x1="172" y1="68" x2="186" y2="64" />
          <line x1="174" y1="88" x2="188" y2="94" />
        </g>

        {/* 2. Левая рука (машущая приветственно игроку, как на фото) */}
        <motion.g
          animate={
            mood === 'pointing'
              ? { rotate: [-10, -25, -10], x: -6, y: -8 }
              : { rotate: [0, 15, -5, 12, 0] }
          }
          transition={{
            duration: mood === 'pointing' ? 0.8 : 2.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ transformOrigin: '48px 138px' }}
        >
          {/* Пухлая машущая лапка */}
          <path
            d="
              M 48 135
              C 35 130, 15 132, 12 120
              C 10 110, 24 105, 34 116
              C 40 122, 46 128, 50 134 Z
            "
            fill="#FF8F00"
            stroke="#E65100"
            strokeWidth="2"
          />
        </motion.g>

        {/* 3. Правая ручка */}
        <path
          d="
            M 148 136
            C 160 138, 172 144, 170 152
            C 168 158, 158 156, 146 148 Z
          "
          fill="#FF8F00"
          stroke="#E65100"
          strokeWidth="2"
        />

        {/* 4. Ножки (две милые пухлые ножки снизу) */}
        <g id="mascot-legs">
          {/* Левая ножка */}
          <path
            d="
              M 72 176
              C 70 192, 65 204, 78 206
              C 88 207, 92 195, 90 180 Z
            "
            fill="#E64A19"
          />
          {/* Правая ножка */}
          <path
            d="
              M 112 180
              C 110 195, 114 207, 124 206
              C 136 204, 132 192, 128 176 Z
            "
            fill="#E64A19"
          />
        </g>

        {/* 5. Основное тело огненного маскота (3 язычка пламени на макушке + пухлый животик) */}
        <path
          d="
            M 100 20
            C 108 38, 118 48, 130 38
            C 134 34, 138 32, 142 36
            C 146 44, 138 60, 146 54
            C 152 50, 158 52, 160 58
            C 166 74, 152 86, 160 102
            C 172 126, 166 160, 142 176
            C 126 186, 74 186, 58 176
            C 34 160, 28 126, 40 102
            C 48 86, 34 74, 40 58
            C 42 52, 48 50, 54 54
            C 62 60, 54 44, 58 36
            C 62 32, 66 34, 70 38
            C 82 48, 92 38, 100 20 Z
          "
          fill="url(#mascotFlameGrad)"
          stroke="#E65100"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 6. Внутреннее светящееся теплое ядро */}
        <path
          d="
            M 100 48
            C 106 62, 115 70, 124 64
            C 136 78, 145 102, 142 126
            C 138 152, 125 168, 100 168
            C 75 168, 62 152, 58 126
            C 55 102, 64 78, 76 64
            C 85 70, 94 62, 100 48 Z
          "
          fill="url(#mascotCoreGrad)"
          opacity="0.9"
        />

        {/* 7. Лицо маскота */}
        {mood === 'locked' ? (
          // Грустное / удивленное выражение при клике на замок
          <g id="face-locked">
            {/* Глазки-дуги или прищуренные */}
            <circle cx="76" cy="120" r="7" fill="#17345F" />
            <circle cx="124" cy="120" r="7" fill="#17345F" />
            {/* Блики */}
            <circle cx="78" cy="118" r="2.5" fill="#FFFFFF" />
            <circle cx="126" cy="118" r="2.5" fill="#FFFFFF" />
            {/* Слезинка */}
            <ellipse cx="64" cy="126" rx="2" ry="4" fill="#60A5FA" />
            {/* Рот огорченный */}
            <path d="M 94 142 Q 100 134 106 142" stroke="#B71C1C" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          // Счастливое открытое личико (как на фото)
          <g id="face-happy">
            {/* Большие выразительные черные глаза с бликами */}
            <ellipse cx="78" cy="116" rx="6.5" ry="8" fill="#17345F" />
            <ellipse cx="122" cy="116" rx="6.5" ry="8" fill="#17345F" />

            {/* Белые сияющие блики в глазах (как в аниме/casual играх) */}
            <circle cx="80" cy="113" r="2.8" fill="#FFFFFF" />
            <circle cx="76" cy="119" r="1.2" fill="#FFFFFF" />
            <circle cx="124" cy="113" r="2.8" fill="#FFFFFF" />
            <circle cx="120" cy="119" r="1.2" fill="#FFFFFF" />

            {/* Румяные розовые щечки */}
            <ellipse cx="66" cy="126" rx="6" ry="3.5" fill="url(#blushGrad)" />
            <ellipse cx="134" cy="126" rx="6" ry="3.5" fill="url(#blushGrad)" />

            {/* Широкая милая улыбка со светлым язычком */}
            <path
              d="M 90 128 C 90 144, 110 144, 110 128 Z"
              fill="#880E4F"
              stroke="#880E4F"
              strokeWidth="2"
            />
            <path
              d="M 94 135 C 97 142, 103 142, 106 135 Z"
              fill="#FF80AB"
            />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
