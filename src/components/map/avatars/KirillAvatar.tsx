// src/components/map/avatars/KirillAvatar.tsx
import React from 'react';

export const KirillAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 90, className = '' }) => {
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
      <circle cx="45" cy="45" r="39" fill="#E6F9F8" />

      <g clipPath="url(#kirillClip)">
        {/* Задние волосы */}
        <ellipse cx="45" cy="42" rx="26" ry="24" fill="#4A2F1B" />

        {/* Синяя худи */}
        <path d="M 20 88 C 22 66, 68 66, 70 88 Z" fill="#2984D4" />
        {/* Капюшон худи */}
        <path d="M 32 68 C 36 62, 54 62, 58 68 Z" fill="#1C6EB4" />
        {/* Белая футболка под худи */}
        <path d="M 40 68 L 45 74 L 50 68 Z" fill="#FFFFFF" />

        {/* Шея */}
        <rect x="40" y="58" width="10" height="10" rx="3" fill="#FCD3B4" />

        {/* Лицо */}
        <ellipse cx="45" cy="48" rx="17" ry="16" fill="#FCD3B4" />

        {/* Уши */}
        <circle cx="28" cy="49" r="4" fill="#FCD3B4" />
        <circle cx="62" cy="49" r="4" fill="#FCD3B4" />

        {/* Короткие каштановые волосы с прядками */}
        <path
          d="
            M 27 42 
            C 27 28, 63 28, 63 42 
            C 58 37, 54 41, 48 36
            C 44 40, 36 36, 27 42 Z
          "
          fill="#5C3B24"
        />

        {/* Очки или стильные глаза */}
        {/* Глаза */}
        <ellipse cx="38" cy="48" rx="2.5" ry="3.2" fill="#17345F" />
        <ellipse cx="52" cy="48" rx="2.5" ry="3.2" fill="#17345F" />
        {/* Блики */}
        <circle cx="39" cy="46.5" r="1.1" fill="#FFFFFF" />
        <circle cx="53" cy="46.5" r="1.1" fill="#FFFFFF" />

        {/* Брови */}
        <path d="M 35 42 Q 38 41 41 43" stroke="#4A2F1B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 49 43 Q 52 41 55 42" stroke="#4A2F1B" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Легкий румянец */}
        <ellipse cx="34" cy="52" rx="3.5" ry="1.8" fill="#FF8D7B" opacity="0.5" />
        <ellipse cx="56" cy="52" rx="3.5" ry="1.8" fill="#FF8D7B" opacity="0.5" />

        {/* Улыбка */}
        <path d="M 41 54 Q 45 58 49 54" stroke="#4A2F1B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </g>

      <defs>
        <clipPath id="kirillClip">
          <circle cx="45" cy="45" r="39" />
        </clipPath>
      </defs>
    </svg>
  );
};
