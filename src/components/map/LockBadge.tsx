// src/components/map/LockBadge.tsx
import React from 'react';

interface LockBadgeProps {
  size?: number;
  variant?: 'gold' | 'silver';
  className?: string;
}

export const LockBadge: React.FC<LockBadgeProps> = ({
  size = 80,
  variant = 'gold',
  className = ''
}) => {
  const isGold = variant === 'gold';

  const bodyGradientId = `lock-body-${variant}`;
  const rimGradientId = `lock-rim-${variant}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`select-none drop-shadow-xl ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Градиент корпуса замка */}
        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          {isGold ? (
            <>
              <stop offset="0%" stopColor="#FFF082" />
              <stop offset="25%" stopColor="#FFC83B" />
              <stop offset="75%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#CBD5E1" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </>
          )}
        </linearGradient>

        {/* Градиент ободка замка */}
        <linearGradient id={rimGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          {isGold ? (
            <>
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="100%" stopColor="#B45309" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#475569" />
            </>
          )}
        </linearGradient>

        {/* Металлическая дужка */}
        <linearGradient id="shackleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="30%" stopColor="#F1F5F9" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>

      {/* Тень под замком */}
      <ellipse cx="50" cy="90" rx="34" ry="7" fill="rgba(15, 23, 42, 0.25)" />

      {/* Белый контур-обводка вокруг всего замка (как на референсе) */}
      {/* 1. Дужка замка (Shackle) */}
      <path
        d="M 32 46 V 26 C 32 16, 68 16, 68 26 V 46"
        stroke="#FFFFFF"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M 32 46 V 26 C 32 16, 68 16, 68 26 V 46"
        stroke="url(#shackleGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Темная обводка дужки */}
      <path
        d="M 32 46 V 26 C 32 16, 68 16, 68 26 V 46"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* 2. Корпус замка */}
      {/* Белая внешняя подложка-наклейка */}
      <rect
        x="18"
        y="40"
        width="64"
        height="50"
        rx="18"
        fill="#FFFFFF"
      />
      {/* Основной золотой/серебряный корпус */}
      <rect
        x="21"
        y="43"
        width="58"
        height="44"
        rx="15"
        fill={`url(#${bodyGradientId})`}
        stroke={isGold ? '#B45309' : '#475569'}
        strokeWidth="3.5"
      />

      {/* Внутренняя фаска / блик сверху */}
      <path
        d="M 33 46 Q 50 49 67 46"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />

      {/* Замочная скважина (Keyhole) */}
      <circle cx="50" cy="61" r="5.5" fill="#78350F" />
      <polygon points="46.5,62 53.5,62 52,74 48,74" fill="#78350F" />

      {/* Золотистый акцент скважины */}
      <circle cx="50" cy="61" r="2" fill="#D97706" />
    </svg>
  );
};
