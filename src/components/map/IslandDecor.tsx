// src/components/map/IslandDecor.tsx
import React from 'react';
import { IslandTheme } from '../../data/islands';

interface IslandDecorProps {
  theme: IslandTheme;
  className?: string;
}

export const IslandDecor: React.FC<IslandDecorProps> = ({ theme, className = '' }) => {
  return (
    <svg
      viewBox="0 0 300 200"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Градиент листвы дерева */}
        <linearGradient id="treeGradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="40%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        <linearGradient id="treeGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="50%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
      </defs>

      {/* Деревья слева */}
      <g id="left-trees">
        {/* Дерево 1 (дальнее, повыше) */}
        <rect x="58" y="55" width="4" height="14" rx="2" fill="#78350F" />
        <circle cx="60" cy="50" r="14" fill="url(#treeGradDark)" />
        <circle cx="63" cy="46" r="6" fill="#86EFAC" opacity="0.6" />

        {/* Дерево 2 (поближе) */}
        <rect x="74" y="65" width="4" height="16" rx="2" fill="#78350F" />
        <circle cx="76" cy="60" r="16" fill="url(#treeGradGreen)" />
        <circle cx="79" cy="55" r="7" fill="#BBF7D0" opacity="0.7" />
      </g>

      {/* Деревья справа */}
      <g id="right-trees">
        {/* Для Мари — маленький милый домик справа */}
        {theme === 'orange' ? (
          <g transform="translate(210, 68)">
            <rect x="0" y="8" width="18" height="16" rx="2" fill="#FFFBEB" stroke="#B45309" strokeWidth="1.5" />
            <polygon points="9,0 -2,8 20,8" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
            <rect x="6" y="14" width="6" height="10" rx="1" fill="#78350F" />
          </g>
        ) : theme === 'purple' ? (
          // Для Сони — сиреневый домик справа и дерево
          <>
            <g transform="translate(225, 70)">
              <rect x="0" y="6" width="16" height="14" rx="2" fill="#F3E8FF" stroke="#7E22CE" strokeWidth="1.5" />
              <polygon points="8,0 -2,6 18,6" fill="#9333EA" stroke="#6B21A8" strokeWidth="1.5" />
            </g>
            <rect x="212" y="64" width="4" height="14" rx="2" fill="#78350F" />
            <circle cx="214" cy="58" r="13" fill="url(#treeGradGreen)" />
          </>
        ) : (
          // Для Кирилла и Мегаполиса — сочные круглые деревья справа
          <>
            <rect x="224" y="58" width="4" height="14" rx="2" fill="#78350F" />
            <circle cx="226" cy="52" r="14" fill="url(#treeGradDark)" />
            <circle cx="229" cy="48" r="6" fill="#86EFAC" opacity="0.6" />

            <rect x="238" y="68" width="3.5" height="14" rx="1.5" fill="#78350F" />
            <circle cx="240" cy="62" r="12" fill="url(#treeGradGreen)" />
          </>
        )}
      </g>
    </svg>
  );
};
