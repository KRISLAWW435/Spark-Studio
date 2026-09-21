// src/components/map/MapPath.tsx
import React from 'react';
import { LockBadge } from './LockBadge';

interface MapPathProps {
  onLockClick?: (type: 'silver' | 'gold') => void;
}

export const MapPath: React.FC<MapPathProps> = ({ onLockClick }) => {
  return (
    <svg
      viewBox="0 0 1600 900"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Белая стрелка-маркер */}
        <marker
          id="white-arrow"
          viewBox="0 0 16 16"
          refX="8"
          refY="8"
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          <path d="M 2 3 L 14 8 L 2 13 Z" fill="#FFFFFF" />
        </marker>

        {/* Тень для стрелки */}
        <filter id="pathShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#024D82" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#pathShadow)">
        {/* 1. Путь от Кофейни Мари к Техно-хабу Кирилла */}
        <path
          d="M 480 390 C 560 320, 680 270, 710 260"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeDasharray="14 16"
          strokeLinecap="round"
          markerEnd="url(#white-arrow)"
        />

        {/* 2. Путь от Техно-хаба Кирилла к Мастерской Сони */}
        <path
          d="M 890 260 C 980 280, 1070 330, 1110 360"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeDasharray="14 16"
          strokeLinecap="round"
          markerEnd="url(#white-arrow)"
        />

        {/* 3. Путь от Техно-хаба Кирилла вниз к Мегаполису */}
        <path
          d="M 800 370 L 800 500"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeDasharray="14 16"
          strokeLinecap="round"
          markerEnd="url(#white-arrow)"
        />

        {/* 4. Путь от Мастерской Сони к Мегаполису */}
        <path
          d="M 1110 430 C 1030 500, 960 550, 915 575"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeDasharray="14 16"
          strokeLinecap="round"
          markerEnd="url(#white-arrow)"
        />

        {/* 5. Боковой заблокированный путь слева от Мари (Серебряный замок) */}
        <path
          d="M 330 400 C 300 350, 310 320, 340 310"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeDasharray="12 14"
          strokeLinecap="round"
        />

        {/* 6. Боковой заблокированный путь справа-сверху от Кирилла (Золотой замок) */}
        <path
          d="M 870 200 C 930 180, 970 190, 1010 200"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeDasharray="12 14"
          strokeLinecap="round"
        />
      </g>

      {/* Интерактивные замки на ответвлениях путей */}
      <g
        className="pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-110"
        transform="translate(290, 275)"
        onClick={() => onLockClick && onLockClick('silver')}
        id="side-lock-silver"
      >
        <LockBadge size={68} variant="silver" />
      </g>

      <g
        className="pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-110"
        transform="translate(980, 140)"
        onClick={() => onLockClick && onLockClick('gold')}
        id="side-lock-gold"
      >
        <LockBadge size={68} variant="gold" />
      </g>
    </svg>
  );
};
