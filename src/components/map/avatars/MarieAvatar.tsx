// src/components/map/avatars/MarieAvatar.tsx
import React from 'react';

export const MarieAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 90, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      className={`select-none drop-shadow-md ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Белая внешняя окантовка и фоновый круг */}
      <circle cx="45" cy="45" r="43" fill="#FFFFFF" />
      <circle cx="45" cy="45" r="39" fill="#FFF2DE" />

      <g clipPath="url(#marieClip)">
        {/* Задняя часть рыжих волос */}
        <ellipse cx="45" cy="46" rx="30" ry="32" fill="#E86A25" />
        <ellipse cx="25" cy="52" rx="14" ry="16" fill="#E86A25" />
        <ellipse cx="65" cy="52" rx="14" ry="16" fill="#E86A25" />

        {/* Плечи и одежда (мятно-голубая блузка) */}
        <path d="M 20 88 C 24 66, 66 66, 70 88 Z" fill="#4FBDB8" />
        <path d="M 38 68 L 45 76 L 52 68 Z" fill="#FFFFFF" />

        {/* Шея */}
        <rect x="40" y="58" width="10" height="12" rx="4" fill="#FCD3B4" />

        {/* Лицо */}
        <ellipse cx="45" cy="47" rx="18" ry="17" fill="#FCD3B4" />

        {/* Ушки */}
        <circle cx="27" cy="48" r="4.5" fill="#FCD3B4" />
        <circle cx="63" cy="48" r="4.5" fill="#FCD3B4" />

        {/* Рыжая челка и боковые пряди */}
        <path
          d="
            M 26 44 
            C 26 30, 64 30, 64 44 
            C 60 38, 52 38, 48 42
            C 44 38, 32 38, 26 44 Z
          "
          fill="#F27A32"
        />
        {/* Пряди по бокам */}
        <path d="M 26 40 C 24 48, 28 58, 31 62 C 28 54, 28 46, 30 40 Z" fill="#F27A32" />
        <path d="M 64 40 C 66 48, 62 58, 59 62 C 62 54, 62 46, 60 40 Z" fill="#F27A32" />

        {/* Глаза */}
        <ellipse cx="38" cy="47" rx="2.5" ry="3.5" fill="#233C5F" />
        <ellipse cx="52" cy="47" rx="2.5" ry="3.5" fill="#233C5F" />
        {/* Блики в глазах */}
        <circle cx="39" cy="45.5" r="1.2" fill="#FFFFFF" />
        <circle cx="53" cy="45.5" r="1.2" fill="#FFFFFF" />

        {/* Румянец */}
        <ellipse cx="33" cy="51" rx="4" ry="2" fill="#FF8D7B" opacity="0.6" />
        <ellipse cx="57" cy="51" rx="4" ry="2" fill="#FF8D7B" opacity="0.6" />

        {/* Брови */}
        <path d="M 35 41 Q 38 40 41 42" stroke="#C25215" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 49 42 Q 52 40 55 41" stroke="#C25215" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Улыбка */}
        <path d="M 41 53 Q 45 57 49 53" stroke="#C25215" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>

      <defs>
        <clipPath id="marieClip">
          <circle cx="45" cy="45" r="39" />
        </clipPath>
      </defs>
    </svg>
  );
};
