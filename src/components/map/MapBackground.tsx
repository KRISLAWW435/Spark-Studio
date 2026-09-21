// src/components/map/MapBackground.tsx
import React from 'react';

export const MapBackground: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1600 900"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Градиент неба */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#58C9F3" />
          <stop offset="45%" stopColor="#6CD1F7" />
          <stop offset="70%" stopColor="#86DCFA" />
          <stop offset="100%" stopColor="#67CAFA" />
        </linearGradient>

        {/* Градиент волн океана */}
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#58C9F3" stopOpacity="0" />
          <stop offset="40%" stopColor="#48BFEE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#30AEE6" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* 1. Базовый небесный фон */}
      <rect width="1600" height="900" fill="url(#skyGrad)" />

      {/* 2. Морская лазурная толща снизу */}
      <rect y="400" width="1600" height="500" fill="url(#oceanGrad)" />

      {/* 3. Водные ряби и блики волн */}
      <g stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.45">
        <path d="M 120 480 Q 135 474 150 480" />
        <path d="M 170 510 Q 185 504 200 510" />
        <path d="M 140 540 Q 155 534 170 540" />

        <path d="M 380 570 Q 400 562 420 570" />
        <path d="M 540 480 Q 560 472 580 480" />
        <path d="M 640 530 Q 660 522 680 530" />

        <path d="M 980 490 Q 1000 482 1020 490" />
        <path d="M 1040 540 Q 1060 532 1080 540" />

        <path d="M 1320 470 Q 1340 462 1360 470" />
        <path d="M 1380 510 Q 1400 502 1420 510" />
        <path d="M 1450 550 Q 1470 542 1490 550" />
      </g>

      {/* 4. Далекие островки на горизонте слева и справа */}
      {/* Слева */}
      <g id="distant-island-left" transform="translate(0, 460)">
        <ellipse cx="60" cy="85" rx="75" ry="16" fill="#024D82" opacity="0.18" />
        {/* Скала */}
        <path d="M 0 50 Q 60 70 90 60 Q 70 100 0 100 Z" fill="#2E6962" />
        {/* Зелень */}
        <path d="M 0 45 Q 40 40 70 48 Q 90 55 85 62 Q 50 68 0 58 Z" fill="#58CC6B" />
        <path d="M 0 42 Q 35 38 65 45 Z" fill="#7FE58F" />
      </g>

      {/* Справа */}
      <g id="distant-island-right" transform="translate(1480, 520)">
        <ellipse cx="60" cy="75" rx="60" ry="14" fill="#024D82" opacity="0.18" />
        <path d="M 20 60 Q 60 85 120 70 L 120 100 L 20 100 Z" fill="#2E6962" />
        <path d="M 20 55 Q 60 48 120 58 L 120 68 Q 60 62 20 60 Z" fill="#58CC6B" />
      </g>

      {/* 5. Мягкие пушистые белые облака по небу и горизонту */}
      {/* Облако верхнее левое */}
      <g fill="#FFFFFF" opacity="0.95" transform="translate(-40, 180)">
        <ellipse cx="120" cy="60" rx="90" ry="32" />
        <circle cx="100" cy="40" r="42" />
        <circle cx="150" cy="45" r="32" />
        <circle cx="60" cy="55" r="28" />
      </g>

      {/* Облако верхнее правое */}
      <g fill="#FFFFFF" opacity="0.95" transform="translate(1260, 190)">
        <ellipse cx="120" cy="60" rx="100" ry="34" />
        <circle cx="95" cy="40" r="45" />
        <circle cx="150" cy="42" r="35" />
        <circle cx="180" cy="55" r="26" />
      </g>

      {/* Облако на горизонте по центру */}
      <g fill="#FFFFFF" opacity="0.8" transform="translate(680, 120)">
        <ellipse cx="70" cy="35" rx="60" ry="18" />
        <circle cx="60" cy="25" r="22" />
        <circle cx="85" cy="28" r="18" />
      </g>

      {/* 6. Большой массив кучевых облаков внизу экрана (под навигацией и маскотом) */}
      <g fill="#FFFFFF" opacity="0.98">
        {/* Слева внизу */}
        <ellipse cx="140" cy="880" rx="240" ry="80" />
        <circle cx="120" cy="800" r="75" />
        <circle cx="220" cy="815" r="60" />
        <circle cx="50" cy="820" r="55" />

        {/* Справа внизу (под маскотом) */}
        <ellipse cx="1450" cy="890" rx="260" ry="90" />
        <circle cx="1420" cy="805" r="85" />
        <circle cx="1320" cy="825" r="70" />
        <circle cx="1530" cy="820" r="75" />
      </g>
    </svg>
  );
};
