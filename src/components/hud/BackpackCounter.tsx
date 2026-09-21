// src/components/hud/BackpackCounter.tsx
import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/soundManager';

interface BackpackCounterProps {
  itemCount: number;
  onClick?: () => void;
  className?: string;
}

export const BackpackCounter: React.FC<BackpackCounterProps> = ({
  itemCount,
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        sound.playClick();
        if (onClick) onClick();
      }}
      className={`bg-white rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 flex items-center gap-2 border-2 border-purple-200 border-b-4 border-b-purple-400 hover:bg-purple-50/50 cursor-pointer select-none transition-all active:translate-y-0.5 active:border-b-2 shadow-xs ${className}`}
      title="Рюкзак • Коллекция предметов"
      id="hud-backpack"
    >
      {/* Иконка фиолетового рюкзака */}
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full filter drop-shadow-xs" fill="none">
          <rect x="7" y="8" width="22" height="23" rx="7" fill="#9361E8" stroke="#581C87" strokeWidth="1.2" />
          <rect x="10" y="18" width="16" height="11" rx="3.5" fill="#7E22CE" stroke="#3B0764" strokeWidth="1" />
          <line x1="12" y1="21" x2="24" y2="21" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="10" y="9" width="2.5" height="8" rx="1.2" fill="#FB923C" />
          <rect x="23.5" y="9" width="2.5" height="8" rx="1.2" fill="#FB923C" />
        </svg>
      </div>

      <span className="text-sm sm:text-base font-black text-[#17345F] tracking-tight">
        {itemCount}
      </span>
    </motion.button>
  );
};
