// src/components/mascot/SparkSprite.tsx
import React from 'react';
import { motion } from 'motion/react';

export type SparkSpriteMode = 'silhouette' | 'full' | 'waving';

export interface SparkSpriteProps {
  mode?: SparkSpriteMode;
  size?: number;
  className?: string;
  /**
   * Путь к изображению персонажа.
   * Когда будет готов файл spark.png, передайте imageSrc="/spark.png"
   * или установите флаг USE_PNG_SPRITE = true.
   */
  imageSrc?: string;
}

// Флаг для быстрого переключения на растровый спрайт spark.png в будущем
export const USE_PNG_SPRITE = false;

export const SparkSprite: React.FC<SparkSpriteProps> = ({
  mode = 'full',
  size = 220,
  className = '',
  imageSrc = '/spark.png'
}) => {
  // 1. Если в будущем используется PNG-картинка:
  if (USE_PNG_SPRITE && imageSrc) {
    return (
      <div
        className={`relative select-none flex items-center justify-center ${className}`}
        style={{ width: size, height: size * 1.15 }}
      >
        <img
          src={imageSrc}
          alt="Спарк"
          className={`w-full h-full object-contain filter drop-shadow-xl transition-all duration-500 ${
            mode === 'silhouette' ? 'brightness-0 contrast-200 opacity-60' : 'opacity-100'
          }`}
          draggable={false}
        />
      </div>
    );
  }

  // 2. Векторный спрайт (SVG-заглушка с переключением силуэт / цветной / машущий)
  const isSilhouette = mode === 'silhouette';
  const isWaving = mode === 'waving';

  return (
    <div
      id="spark-sprite"
      data-testid="spark-sprite"
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.15}px` }}
    >
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full filter drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Градиент цветного тела пламени */}
          <linearGradient id="sparkFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="25%" stopColor="#FFB300" />
            <stop offset="60%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#E64A19" />
          </linearGradient>

          {/* Внутреннее золотистое ядро пламени */}
          <linearGradient id="sparkCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF59D" />
            <stop offset="85%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFB74D" />
          </linearGradient>

          {/* Градиент тёмного силуэта */}
          <linearGradient id="sparkSilhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Румянец */}
          <radialGradient id="sparkBlushGrad">
            <stop offset="0%" stopColor="#FF5252" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Энергетические искры-штрихи вокруг головы (только в цветном режиме) */}
        {!isSilhouette && (
          <g stroke="#FF7A00" strokeWidth="5" strokeLinecap="round">
            <line x1="28" y1="62" x2="16" y2="58" />
            <line x1="25" y1="84" x2="12" y2="88" />
            <line x1="172" y1="68" x2="186" y2="64" />
            <line x1="174" y1="88" x2="188" y2="94" />
          </g>
        )}

        {/* Левая рука */}
        <path
          d="
            M 48 135
            C 35 130, 15 132, 12 120
            C 10 110, 24 105, 34 116
            C 40 122, 46 128, 50 134 Z
          "
          fill={isSilhouette ? '#1E1B4B' : '#FF8F00'}
          stroke={isSilhouette ? '#4338CA' : '#E65100'}
          strokeWidth="2"
        />

        {/* Правая рука Спарка (с анимацией махания при mode === 'waving') */}
        <motion.g
          animate={
            isWaving
              ? { rotate: [0, -30, 0, -30, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 1.0,
            repeat: isWaving ? 2 : 0,
            ease: 'easeInOut'
          }}
          style={{ transformOrigin: '148px 145px' }}
        >
          <path
            d="
              M 148 136
              C 162 134, 180 126, 184 116
              C 186 106, 172 104, 162 118
              C 156 124, 152 130, 146 148 Z
            "
            fill={isSilhouette ? '#1E1B4B' : '#FF8F00'}
            stroke={isSilhouette ? '#4338CA' : '#E65100'}
            strokeWidth="2"
          />
        </motion.g>

        {/* Ножки */}
        <g id="spark-legs">
          <path
            d="
              M 72 176
              C 70 192, 65 204, 78 206
              C 88 207, 92 195, 90 180 Z
            "
            fill={isSilhouette ? '#0F172A' : '#E64A19'}
          />
          <path
            d="
              M 112 180
              C 110 195, 114 207, 124 206
              C 136 204, 132 192, 128 176 Z
            "
            fill={isSilhouette ? '#0F172A' : '#E64A19'}
          />
        </g>

        {/* Основное тело пламени */}
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
          fill={isSilhouette ? 'url(#sparkSilhouetteGrad)' : 'url(#sparkFlameGrad)'}
          stroke={isSilhouette ? '#6366F1' : '#E65100'}
          strokeWidth={isSilhouette ? '2' : '3.5'}
          strokeLinejoin="round"
        />

        {/* Внутреннее светящееся теплое ядро (только в цветном режиме) */}
        {!isSilhouette && (
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
            fill="url(#sparkCoreGrad)"
            opacity="0.92"
          />
        )}

        {/* Лицо Спарка (глазки, блики, румянец, улыбка — только в цветном режиме) */}
        {!isSilhouette && (
          <g id="spark-face">
            {/* Большие выразительные черные глаза с бликами */}
            <ellipse cx="78" cy="116" rx="6.5" ry="8" fill="#17345F" />
            <ellipse cx="122" cy="116" rx="6.5" ry="8" fill="#17345F" />

            {/* Белые сияющие блики в глазах */}
            <circle cx="80" cy="113" r="2.8" fill="#FFFFFF" />
            <circle cx="76" cy="119" r="1.2" fill="#FFFFFF" />
            <circle cx="124" cy="113" r="2.8" fill="#FFFFFF" />
            <circle cx="120" cy="119" r="1.2" fill="#FFFFFF" />

            {/* Румяные розовые щечки */}
            <ellipse cx="66" cy="126" rx="6" ry="3.5" fill="url(#sparkBlushGrad)" />
            <ellipse cx="134" cy="126" rx="6" ry="3.5" fill="url(#sparkBlushGrad)" />

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
    </div>
  );
};
