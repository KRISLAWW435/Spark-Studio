// src/components/navigation/NavigationTab.tsx
import React from 'react';
import { motion } from 'motion/react';
import { MarieAvatar } from '../map/avatars/MarieAvatar';
import { SonyaAvatar } from '../map/avatars/SonyaAvatar';
import { sound } from '../../utils/soundManager';

export interface NavigationTabItem {
  id: string;
  label: string;
  theme: 'orange' | 'teal' | 'purple';
  iconType: 'marie' | 'techno' | 'sonya';
}

interface NavigationTabProps {
  item: NavigationTabItem;
  isActive: boolean;
  onClick: () => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({
  item,
  isActive,
  onClick
}) => {
  const getThemeClasses = () => {
    switch (item.theme) {
      case 'orange':
        return isActive
          ? 'bg-[#FFE2C2] border-[#FF9F2F] border-b-[#D97706] text-[#C2410C] ring-4 ring-[#FF9F2F]/40'
          : 'bg-[#FFF3E3] border-[#FFD4A1] border-b-[#FDBA74] text-[#9A3412] hover:bg-[#FFE8CC]';
      case 'teal':
        return isActive
          ? 'bg-[#CCFBF1] border-[#2DD4BF] border-b-[#0F766E] text-[#0F766E] ring-4 ring-[#2DD4BF]/40'
          : 'bg-[#E6FFFA] border-[#99F6E4] border-b-[#5EEAD4] text-[#115E59] hover:bg-[#D1FAF4]';
      case 'purple':
        return isActive
          ? 'bg-[#F3E8FF] border-[#C084FC] border-b-[#7E22CE] text-[#7E22CE] ring-4 ring-[#C084FC]/40'
          : 'bg-[#FAF5FF] border-[#E9D5FF] border-b-[#D8B4FE] text-[#6B21A8] hover:bg-[#F3E8FF]';
    }
  };

  const handleClick = () => {
    sound.playClick();
    onClick();
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`w-18 sm:w-22 h-18 sm:h-22 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-1.5 transition-all duration-150 select-none cursor-pointer border-2 border-b-4 active:translate-y-1 active:border-b-2 shadow-xs ${getThemeClasses()}`}
      id={`nav-tab-${item.id}`}
    >
      {/* Иконка вкладки */}
      <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center mb-0.5">
        {item.iconType === 'marie' && (
          <MarieAvatar size={44} className="transform scale-90" />
        )}

        {item.iconType === 'techno' && (
          <div className="w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
              <rect x="16" y="27" width="4" height="4" rx="1" fill="#0284C7" />
              <rect x="11" y="30" width="14" height="2" rx="1" fill="#0369A1" />
              <rect x="4" y="5" width="28" height="22" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
              <rect x="7" y="8" width="22" height="15" rx="2" fill="#E0F2FE" />
              <rect x="10" y="11" width="9" height="2" rx="1" fill="#0284C7" />
              <rect x="10" y="15" width="15" height="1.5" rx="0.5" fill="#38BDF8" />
            </svg>
          </div>
        )}

        {item.iconType === 'sonya' && (
          <SonyaAvatar size={44} className="transform scale-90" />
        )}
      </div>

      {/* Текст в стиле Duolingo */}
      <span className="text-xs sm:text-sm font-black tracking-tight uppercase whitespace-nowrap">
        {item.label}
      </span>
    </motion.button>
  );
};
