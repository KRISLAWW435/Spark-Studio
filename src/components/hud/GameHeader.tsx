// src/components/hud/GameHeader.tsx
import React from 'react';
import { Menu } from 'lucide-react';
import { PlayerHUD } from './PlayerHUD';
import { PlayerState } from '../../data/player';
import { sound } from '../../utils/soundManager';

interface GameHeaderProps {
  player: PlayerState;
  onCoinsClick?: () => void;
  onBackpackClick?: () => void;
  onStreakClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  player,
  onCoinsClick,
  onBackpackClick,
  onStreakClick,
  onMenuClick,
  className = ''
}) => {
  return (
    <header className={`w-full flex items-center justify-between pointer-events-auto px-3 sm:px-6 py-2.5 z-20 ${className}`}>
      {/* Левая часть: Мобильный бургер + Карточка с названием игры */}
      <div className="flex items-center gap-2">
        {/* Кнопка открытия бокового меню (для планшетов и мобильных устройств) */}
        {onMenuClick && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onMenuClick();
            }}
            className="lg:hidden p-2 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] text-[#17345F] hover:bg-slate-50 transition-all active:translate-y-0.5 active:border-b-2 cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
            aria-label="Открыть меню"
            title="Меню"
          >
            <Menu size={20} strokeWidth={2.8} />
          </button>
        )}

        {/* Плашка локации в стиле Duolingo */}
        <div
          className="bg-white rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] flex items-center gap-2 sm:gap-2.5 shadow-xs select-none"
          id="game-header-brand"
        >
          {/* Иконка книги с вылетающей золотой звездой */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-xl bg-[#52D2CC] p-1 shadow-inner border border-[#27B2AD]">
            <svg viewBox="0 0 40 40" className="w-full h-full filter drop-shadow-xs" fill="none">
              <path
                d="M 6 12 C 14 8, 20 11, 20 28 C 14 26, 8 27, 6 29 Z"
                fill="#FFFFFF"
                stroke="#0D9488"
                strokeWidth="1.5"
              />
              <path
                d="M 34 12 C 26 8, 20 11, 20 28 C 26 26, 32 27, 34 29 Z"
                fill="#FFFFFF"
                stroke="#0D9488"
                strokeWidth="1.5"
              />
              <path d="M 20 11 L 20 28" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
              <g transform="translate(14, 2)">
                <polygon
                  points="6,0 7.8,4.2 12,4.8 8.8,7.8 9.6,12 6,9.8 2.4,12 3.2,7.8 0,4.8 4.2,4.2"
                  fill="#FDE047"
                  stroke="#D97706"
                  strokeWidth="1"
                />
              </g>
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-xs sm:text-sm md:text-base font-black text-[#17345F] tracking-tight whitespace-nowrap">
              Архипелаг UX
            </span>
            <span className="hidden sm:inline text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mt-0.5">
              Карта мира
            </span>
          </div>
        </div>
      </div>

      {/* Правая часть: HUD (Серия + Монеты + Рюкзак) */}
      <PlayerHUD
        player={player}
        onCoinsClick={onCoinsClick}
        onBackpackClick={onBackpackClick}
        onStreakClick={onStreakClick}
      />
    </header>
  );
};
