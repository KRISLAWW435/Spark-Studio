// src/components/ui/OrganicButton.tsx
import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/soundManager';

export interface OrganicButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  shape?: 0 | 1 | 2;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  title?: string;
  fullWidth?: boolean;
}

// Три органические формы пути (SVG path), имитирующие мазок краски / текучее желе
const ORGANIC_PATHS = [
  // Форма 0: Мягкий органический мазок с легкой волной
  'M 26,6 C 85,3 215,7 274,5 C 291,7 298,19 296,36 C 293,52 287,64 270,65 C 215,67 85,64 27,65 C 10,65 3,51 4,35 C 5,18 11,8 26,6 Z',
  // Форма 1: Текучая капля с легким наклоном
  'M 25,5 C 95,8 205,3 275,7 C 292,9 298,22 295,38 C 292,53 285,65 268,66 C 205,64 95,67 25,64 C 8,63 3,48 4,33 C 5,17 12,6 25,5 Z',
  // Форма 2: Округлая плавная форма
  'M 28,7 C 90,4 210,6 272,5 C 289,7 297,20 295,36 C 293,51 288,64 271,65 C 210,66 90,65 28,65 C 11,65 4,51 4,35 C 4,19 12,8 28,7 Z',
];

export function OrganicButton({
  variant = 'primary',
  size = 'md',
  shape = 0,
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  type = 'button',
  id,
  title,
  fullWidth = false,
}: OrganicButtonProps) {
  const pathD = ORGANIC_PATHS[shape % ORGANIC_PATHS.length];

  // Цветовые конфигурации градиентов и 3D-теней
  const colorConfigs = {
    primary: {
      gradientId: 'organic-btn-grad-primary',
      from: '#FFA000',
      to: '#FF5A00',
      shadowColor: '#CC4400',
      textColor: 'text-white',
      stroke: '#FFAA33',
      strokeWidth: '1.5',
      glow: 'rgba(255, 120, 0, 0.4)',
    },
    secondary: {
      gradientId: 'organic-btn-grad-secondary',
      from: '#A855F7',
      to: '#7E22CE',
      shadowColor: '#581C87',
      textColor: 'text-white',
      stroke: '#C084FC',
      strokeWidth: '1.5',
      glow: 'rgba(147, 51, 234, 0.4)',
    },
    success: {
      gradientId: 'organic-btn-grad-success',
      from: '#22C55E',
      to: '#16A34A',
      shadowColor: '#14532D',
      textColor: 'text-white',
      stroke: '#4ADE80',
      strokeWidth: '1.5',
      glow: 'rgba(34, 197, 94, 0.4)',
    },
    outline: {
      gradientId: 'organic-btn-grad-outline',
      from: '#FFFFFF',
      to: '#F8FAFC',
      shadowColor: '#CBD5E1',
      textColor: 'text-[#7C3AED]',
      stroke: '#8B5CF6',
      strokeWidth: '2.5',
      glow: 'rgba(139, 92, 246, 0.25)',
    },
  };

  const cfg = colorConfigs[variant];

  // Размеры кнопок
  const heightClasses = {
    sm: 'h-[44px] text-sm px-4',
    md: 'h-[56px] text-base sm:text-lg px-6',
    lg: 'h-[68px] sm:h-[74px] text-lg sm:text-xl px-7',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    try {
      sound.playClick();
    } catch {
      // Игнорируем ошибки звука
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      id={id}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      whileHover={
        !disabled
          ? {
              scale: 1.02,
              scaleX: 1.025,
              scaleY: 0.985,
              filter: 'brightness(1.05)',
            }
          : undefined
      }
      whileTap={
        !disabled
          ? {
              scale: 0.97,
              scaleY: 0.94,
              filter: 'brightness(0.96)',
            }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer focus:outline-hidden group ${
        fullWidth ? 'w-full' : ''
      } ${heightClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* ============ SVG ЖИВАЯ ОРГАНИЧЕСКАЯ ФОРМА ============ */}
      <svg
        viewBox="0 0 300 70"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id={`${cfg.gradientId}-${shape}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={cfg.from} />
            <stop offset="100%" stopColor={cfg.to} />
          </linearGradient>
          {/* Внутренний верхний глянец */}
          <linearGradient id="organic-gloss-top" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Нижняя 3D-подложка (толщина и глубина кнопки) */}
        <path
          d={pathD}
          transform="translate(0, 4)"
          fill={cfg.shadowColor}
          opacity="0.9"
        />

        {/* 2. Основное тело кнопки с органическим градиентом */}
        <path
          d={pathD}
          fill={`url(#${cfg.gradientId}-${shape})`}
          stroke={cfg.stroke}
          strokeWidth={cfg.strokeWidth}
          vectorEffect="non-scaling-stroke"
        />

        {/* 3. Верхний органический блик (эффект глазури/желе) */}
        <path
          d="M 28,9 C 85,7 215,8 272,7 C 285,8 288,14 286,22 C 220,18 80,18 14,23 C 14,14 18,9 28,9 Z"
          fill="url(#organic-gloss-top)"
          opacity="0.6"
        />
      </svg>

      {/* ============ ТЕКСТ И ИКОНКА (НАД SVG) ============ */}
      <div
        className={`relative z-10 flex items-center justify-center gap-2.5 font-black tracking-wide ${cfg.textColor} w-full`}
        style={{
          textShadow: variant === 'outline' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
    </motion.button>
  );
}

export default OrganicButton;
