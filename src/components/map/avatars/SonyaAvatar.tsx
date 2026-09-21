// src/components/map/avatars/SonyaAvatar.tsx
import React from 'react';

export const SonyaAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 90, className = '' }) => {
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
      <circle cx="45" cy="45" r="39" fill="#F4ECFF" />

      <g clipPath="url(#sonyaClip)">
        {/* Пышные темные волосы сзади */}
        <ellipse cx="45" cy="48" rx="29" ry="30" fill="#3B231A" />
        <ellipse cx="25" cy="54" rx="13" ry="16" fill="#3B231A" />
        <ellipse cx="65" cy="54" rx="13" ry="16" fill="#3B231A" />

        {/* Фиолетовая кофточка дизайнера */}
        <path d="M 20 88 C 22 66, 68 66, 70 88 Z" fill="#884BE0" />

        {/* Шея */}
        <rect x="40" y="58" width="10" height="11" rx="3" fill="#FCD3B4" />

        {/* Лицо */}
        <ellipse cx="45" cy="48" rx="17" ry="16" fill="#FCD3B4" />

        {/* Ушки */}
        <circle cx="28" cy="49" r="4" fill="#FCD3B4" />
        <circle cx="62" cy="49" r="4" fill="#FCD3B4" />

        {/* Темные волнистые волосы спереди */}
        <path
          d="
            M 27 45 
            C 27 30, 63 30, 63 45 
            C 57 39, 52 40, 47 43
            C 42 39, 34 39, 27 45 Z
          "
          fill="#4A2F23"
        />

        {/* Глаза */}
        <ellipse cx="38" cy="48" rx="2.5" ry="3.5" fill="#17345F" />
        <ellipse cx="52" cy="48" rx="2.5" ry="3.5" fill="#17345F" />
        {/* Блики */}
        <circle cx="39" cy="46.5" r="1.2" fill="#FFFFFF" />
        <circle cx="53" cy="46.5" r="1.2" fill="#FFFFFF" />

        {/* Брови */}
        <path d="M 35 42 Q 38 41 41 43" stroke="#3B231A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 49 43 Q 52 41 55 42" stroke="#3B231A" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Румянец */}
        <ellipse cx="33" cy="52" rx="4" ry="2" fill="#FF8D7B" opacity="0.6" />
        <ellipse cx="57" cy="52" rx="4" ry="2" fill="#FF8D7B" opacity="0.6" />

        {/* Улыбка */}
        <path d="M 41 54 Q 45 58 49 54" stroke="#3B231A" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* В руке цветовой круг / палитра красок (как на референсе) */}
        <g transform="translate(26, 60)">
          <circle cx="8" cy="8" r="7" fill="#FFD85C" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="6" cy="6" r="1.5" fill="#FF6B6B" />
          <circle cx="10" cy="6" r="1.5" fill="#4DABF7" />
          <circle cx="8" cy="10" r="1.5" fill="#51CF66" />
        </g>
      </g>

      <defs>
        <clipPath id="sonyaClip">
          <circle cx="45" cy="45" r="39" />
        </clipPath>
      </defs>
    </svg>
  );
};
