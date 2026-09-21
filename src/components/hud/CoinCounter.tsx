// src/components/hud/CoinCounter.tsx
import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/soundManager';

interface CoinCounterProps {
  coins: number;
  onClick?: () => void;
  className?: string;
}

export const CoinCounter: React.FC<CoinCounterProps> = ({ coins, onClick, className = '' }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        sound.playClick();
        if (onClick) onClick();
      }}
      className={`bg-white rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 border-2 border-amber-200 border-b-4 border-b-amber-400 hover:bg-amber-50/50 cursor-pointer select-none transition-all active:translate-y-0.5 active:border-b-2 shadow-xs ${className}`}
      title="Монеты • Нажми чтобы посмотреть казну"
      id="hud-coins"
    >
      {/* Иконка золотой монеты */}
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full filter drop-shadow-xs" fill="none">
          <circle cx="18" cy="18" r="16" fill="#F59E0B" />
          <circle cx="18" cy="18" r="13" fill="#FDE047" stroke="#D97706" strokeWidth="1.5" />
          <polygon
            points="18,10 20,15 25,15.5 21,19 22.5,24 18,21.5 13.5,24 15,19 11,15.5 16,15"
            fill="#F59E0B"
          />
        </svg>
      </div>

      {/* Текст Duolingo Style */}
      <span className="text-sm sm:text-base font-black text-[#17345F] tracking-tight">
        {coins}
      </span>
    </motion.button>
  );
};
