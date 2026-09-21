// src/components/mascot/MariaCharacter.tsx
import React from 'react';
import { motion } from 'motion/react';

interface MariaCharacterProps {
  size?: number;
  className?: string;
  isHappy?: boolean;
}

export const MariaCharacter: React.FC<MariaCharacterProps> = ({
  size = 220,
  className = '',
  isHappy = true
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={`relative select-none flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.35 }}
    >
      <svg
        viewBox="0 0 240 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Поварской колпак Марии (объемный, белый, с тенями) */}
        <path
          d="M80 85 C55 85, 45 50, 70 30 C75 10, 115 5, 120 25 C135 5, 175 10, 180 30 C195 45, 190 85, 160 85 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="3"
        />
        {/* Ободок колпака */}
        <rect x="75" y="80" width="90" height="20" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />
        <line x1="85" y1="90" x2="155" y2="90" stroke="#F43F5E" strokeWidth="2.5" strokeDasharray="4 4" />

        {/* Волосы каштановые / ореховые с аккуратными прядями */}
        <path
          d="M65 140 C55 105, 75 90, 120 90 C165 90, 185 105, 175 140 C175 160, 180 185, 170 200 C160 170, 155 130, 120 130 C85 130, 80 170, 70 200 C60 185, 65 160, 65 140 Z"
          fill="#92400E"
        />

        {/* Голова и лицо Марии */}
        <ellipse cx="120" cy="135" rx="48" ry="46" fill="#FED7AA" />

        {/* Уши */}
        <ellipse cx="70" cy="140" rx="7" ry="10" fill="#FDBA74" />
        <ellipse cx="170" cy="140" rx="7" ry="10" fill="#FDBA74" />
        {/* Серьги-жемчужинки */}
        <circle cx="70" cy="148" r="3" fill="#F43F5E" />
        <circle cx="170" cy="148" r="3" fill="#F43F5E" />

        {/* Глаза открытые, добрые, сияющие */}
        <ellipse cx="102" cy="132" rx="7" ry="9" fill="#1E293B" />
        <ellipse cx="138" cy="132" rx="7" ry="9" fill="#1E293B" />
        {/* Искры в глазах */}
        <circle cx="100" cy="129" r="2.5" fill="white" />
        <circle cx="104" cy="134" r="1" fill="white" />
        <circle cx="136" cy="129" r="2.5" fill="white" />
        <circle cx="140" cy="134" r="1" fill="white" />

        {/* Реснички */}
        <path d="M95 125 L91 121" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M109 125 L113 121" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M131 125 L127 121" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M145 125 L149 121" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

        {/* Брови изящные */}
        <path d="M92 118 Q102 114 112 118" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M128 118 Q138 114 148 118" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Аккуратный носик */}
        <path d="M118 138 Q120 142 122 138" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Румяные щёчки */}
        <ellipse cx="88" cy="146" rx="9" ry="5" fill="#FB7185" fillOpacity="0.45" />
        <ellipse cx="152" cy="146" rx="9" ry="5" fill="#FB7185" fillOpacity="0.45" />

        {/* Улыбка */}
        <path
          d="M106 150 Q120 166 134 150"
          stroke="#991B1B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="#F43F5E"
        />

        {/* Платье / поварской китель */}
        <path
          d="M75 190 C75 170, 165 170, 165 190 L180 310 C180 315, 60 315, 60 310 Z"
          fill="#FFF1F2"
        />

        {/* Розовый фартук с кармашком */}
        <path
          d="M85 185 L155 185 L165 310 L75 310 Z"
          fill="#FB7185"
        />
        {/* Кармашек с кондитерским венчиком */}
        <rect x="100" y="235" width="40" height="35" rx="6" fill="#F43F5E" />
        <line x1="120" y1="220" x2="120" y2="245" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="120" cy="216" rx="6" ry="8" stroke="#E2E8F0" strokeWidth="2" fill="none" />

        {/* Вкусный капкейк с вишенкой на блюдечке в руках Марии */}
        <g transform="translate(145, 195) scale(0.7)">
          <ellipse cx="40" cy="70" rx="35" ry="10" fill="#E2E8F0" />
          <path d="M20 50 L25 70 L55 70 L60 50 Z" fill="#D97706" />
          <path d="M15 50 Q40 25 65 50 Z" fill="#F472B6" />
          <circle cx="40" cy="30" r="7" fill="#DC2626" />
          <path d="M40 24 Q48 16 46 12" stroke="#15803D" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </motion.div>
  );
};
