// src/components/mascot/MaxCharacter.tsx
import React from 'react';
import { motion } from 'motion/react';

export type MaxMood = 'worried' | 'thinking' | 'excited' | 'grateful';

interface MaxCharacterProps {
  mood?: MaxMood;
  size?: number;
  className?: string;
}

export const MaxCharacter: React.FC<MaxCharacterProps> = ({
  mood = 'thinking',
  size = 140,
  className = ''
}) => {
  // Анимация лёгкого покачивания
  const bounceAnimation = {
    y: mood === 'excited' ? [0, -10, 0] : [0, -4, 0],
    transition: {
      duration: mood === 'excited' ? 0.8 : 2.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  return (
    <motion.div
      animate={bounceAnimation}
      className={`relative select-none flex flex-col items-center ${className}`}
      style={{ width: size, height: size * 1.25 }}
    >
      <svg
        viewBox="0 0 200 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Тело / Жилетка Макса */}
        <path
          d="M50 170 C50 135, 150 135, 150 170 L155 240 C155 245, 145 250, 100 250 C55 250, 45 245, 45 240 Z"
          fill="#0284C7"
        />
        {/* Жёлтая рубашка под жилеткой */}
        <path
          d="M75 140 L100 180 L125 140 Z"
          fill="#FDE047"
        />
        {/* Галстук-бабочка */}
        <path
          d="M90 145 L110 155 L110 145 L90 155 Z"
          fill="#DC2626"
        />
        <circle cx="100" cy="150" r="3" fill="#991B1B" />

        {/* Пуговицы */}
        <circle cx="100" cy="195" r="3.5" fill="#0369A1" />
        <circle cx="100" cy="215" r="3.5" fill="#0369A1" />

        {/* Голова */}
        <ellipse cx="100" cy="85" rx="55" ry="55" fill="#FED7AA" />

        {/* Волосы каштановые пышные */}
        <path
          d="M45 75 C45 35, 80 20, 100 20 C120 20, 155 35, 155 75 C155 85, 150 95, 145 100 C140 70, 130 55, 100 55 C70 55, 60 70, 55 100 C50 95, 45 85, 45 75 Z"
          fill="#78350F"
        />

        {/* Уши */}
        <ellipse cx="44" cy="90" rx="8" ry="12" fill="#FDBA74" />
        <ellipse cx="156" cy="90" rx="8" ry="12" fill="#FDBA74" />

        {/* Очки круглые в стильной оправе */}
        <circle cx="80" cy="85" r="18" stroke="#1E293B" strokeWidth="4" fill="white" fillOpacity="0.3" />
        <circle cx="120" cy="85" r="18" stroke="#1E293B" strokeWidth="4" fill="white" fillOpacity="0.3" />
        <path d="M98 85 L102 85" stroke="#1E293B" strokeWidth="4" />

        {/* Глаза в зависимости от настроения */}
        {mood === 'worried' && (
          <>
            <circle cx="80" cy="87" r="5" fill="#1E293B" />
            <circle cx="120" cy="87" r="5" fill="#1E293B" />
            <circle cx="78" cy="85" r="1.5" fill="white" />
            <circle cx="118" cy="85" r="1.5" fill="white" />
            {/* Брови домиком (беспокойство) */}
            <path d="M68 66 Q80 72 90 70" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M132 66 Q120 72 110 70" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {mood === 'thinking' && (
          <>
            <circle cx="82" cy="83" r="5" fill="#1E293B" />
            <circle cx="122" cy="83" r="5" fill="#1E293B" />
            <circle cx="84" cy="81" r="1.5" fill="white" />
            <circle cx="124" cy="81" r="1.5" fill="white" />
            {/* Брови приподняты */}
            <path d="M70 66 Q80 62 90 66" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M110 64 Q120 60 130 64" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {(mood === 'excited' || mood === 'grateful') && (
          <>
            {/* Счастливые зажмуренные дуги */}
            <path d="M73 86 Q80 80 87 86" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <path d="M113 86 Q120 80 127 86" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            {/* Приподнятые брови */}
            <path d="M70 65 Q80 58 90 65" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M110 65 Q120 58 130 65" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* Румянец */}
        <ellipse cx="65" cy="98" rx="8" ry="4" fill="#F87171" fillOpacity="0.5" />
        <ellipse cx="135" cy="98" rx="8" ry="4" fill="#F87171" fillOpacity="0.5" />

        {/* Нос */}
        <ellipse cx="100" cy="94" rx="4.5" ry="3.5" fill="#FB923C" />

        {/* Рот в зависимости от настроения */}
        {mood === 'worried' && (
          <path d="M92 116 Q100 110 108 116" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}
        {mood === 'thinking' && (
          <path d="M93 112 Q100 115 107 112" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}
        {(mood === 'excited' || mood === 'grateful') && (
          <path d="M88 108 Q100 126 112 108" fill="#BE185D" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Плюшевый мишка в руках у Макса при радости */}
        {(mood === 'grateful' || mood === 'excited') && (
          <g transform="translate(130, 160) scale(0.4)">
            <circle cx="50" cy="50" r="30" fill="#B45309" />
            <circle cx="28" cy="25" r="12" fill="#B45309" />
            <circle cx="72" cy="25" r="12" fill="#B45309" />
            <circle cx="42" cy="45" r="4" fill="#1E293B" />
            <circle cx="58" cy="45" r="4" fill="#1E293B" />
            <ellipse cx="50" cy="55" rx="10" ry="7" fill="#FDE68A" />
            <circle cx="50" cy="52" r="3" fill="#1E293B" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
