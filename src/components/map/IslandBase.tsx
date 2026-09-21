// src/components/map/IslandBase.tsx
import React from 'react';
import { IslandTheme } from '../../data/islands';

interface IslandBaseProps {
  theme: IslandTheme;
  width?: number;
  height?: number;
  className?: string;
}

export const IslandBase: React.FC<IslandBaseProps> = ({
  theme,
  width = 300,
  height = 200,
  className = ''
}) => {
  // Цветовые конфигурации по теме
  const getThemeColors = () => {
    switch (theme) {
      case 'orange':
        return {
          topLight: '#FFBE4D',
          topBase: '#FF9F2F',
          topDark: '#E97A1E',
          rockHighlight: '#4E8A83',
          rockBase: '#2E6962',
          rockDark: '#1E4944'
        };
      case 'teal':
        return {
          topLight: '#8CEEE8',
          topBase: '#53D7D3',
          topDark: '#35BAB6',
          rockHighlight: '#3E837D',
          rockBase: '#255D58',
          rockDark: '#163E3A'
        };
      case 'purple':
        return {
          topLight: '#BF98FA',
          topBase: '#9361E8',
          topDark: '#7543C9',
          rockHighlight: '#436B82',
          rockBase: '#2B4A5C',
          rockDark: '#1B313F'
        };
      case 'blue': // Мегаполис (зеленая база с асфальтовой дорогой как на фото)
      default:
        return {
          topLight: '#7FE58F',
          topBase: '#58CC6B',
          topDark: '#3EA850',
          rockHighlight: '#3A7C77',
          rockBase: '#235853',
          rockDark: '#153A37'
        };
    }
  };

  const colors = getThemeColors();
  const baseGradId = `island-base-grad-${theme}`;
  const rockGradId = `island-rock-grad-${theme}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 200"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Градиент верхушки острова */}
        <linearGradient id={baseGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.topLight} />
          <stop offset="55%" stopColor={colors.topBase} />
          <stop offset="100%" stopColor={colors.topDark} />
        </linearGradient>

        {/* Градиент скалистого конуса */}
        <linearGradient id={rockGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.rockHighlight} />
          <stop offset="45%" stopColor={colors.rockBase} />
          <stop offset="100%" stopColor={colors.rockDark} />
        </linearGradient>
      </defs>

      {/* 1. Скалистая конусообразная толща земли под островом */}
      <g id="island-subterranean">
        <path
          d="
            M 35 105
            C 45 135, 95 175, 145 190
            C 155 192, 165 188, 185 170
            C 215 145, 255 125, 265 105
            C 220 118, 80 118, 35 105 Z
          "
          fill={`url(#${rockGradId})`}
        />
        {/* Каменные ступени и выступы на скале */}
        <path
          d="M 65 125 C 100 155, 175 165, 235 125 C 185 140, 115 140, 65 125 Z"
          fill={colors.rockDark}
          opacity="0.6"
        />
        <path
          d="M 105 150 C 135 175, 170 175, 195 150 C 170 160, 130 160, 105 150 Z"
          fill={colors.rockDark}
          opacity="0.75"
        />
      </g>

      {/* 2. Объемная пушистая кромка плато (Scalloped Cloud Rim) */}
      <g id="island-top-plateau">
        {/* Нижний более темный слой кромки для объема */}
        <path
          d="
            M 30 100
            C 20 85, 25 65, 45 60
            C 40 45, 60 30, 80 32
            C 90 20, 120 18, 140 25
            C 155 15, 190 15, 210 28
            C 230 22, 255 35, 260 55
            C 275 62, 280 85, 268 100
            C 278 112, 255 125, 235 120
            C 215 128, 185 124, 165 120
            C 145 128, 110 126, 90 120
            C 65 128, 35 118, 30 100 Z
          "
          fill={colors.topDark}
        />

        {/* Верхний яркий сочный слой с округлыми облачными фестонами */}
        <path
          d="
            M 32 94
            C 22 80, 27 62, 46 56
            C 42 42, 62 28, 82 30
            C 92 18, 122 16, 142 22
            C 157 12, 192 12, 212 25
            C 232 20, 256 32, 261 52
            C 276 60, 280 82, 268 96
            C 276 108, 254 120, 234 115
            C 214 122, 186 118, 166 114
            C 146 122, 112 120, 92 114
            C 68 122, 38 112, 32 94 Z
          "
          fill={`url(#${baseGradId})`}
        />

        {/* Светлые мягкие блики на верхних гребнях */}
        <ellipse cx="140" cy="30" rx="35" ry="8" fill="#FFFFFF" opacity="0.35" />
        <ellipse cx="205" cy="32" rx="22" ry="6" fill="#FFFFFF" opacity="0.3" />
        <ellipse cx="80" cy="38" rx="20" ry="6" fill="#FFFFFF" opacity="0.3" />

        {/* Для острова Мегаполиса — серая асфальтовая дорога вокруг */}
        {theme === 'blue' && (
          <path
            d="M 55 95 C 60 112, 240 112, 245 95"
            stroke="#64748B"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {theme === 'blue' && (
          <path
            d="M 62 95 C 75 107, 225 107, 238 95"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="6,6"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
    </svg>
  );
};
