// src/components/hud/PlayerHUD.tsx
import React from 'react';
import { motion } from 'motion/react';
import { CoinCounter } from './CoinCounter';
import { BackpackCounter } from './BackpackCounter';
import { PlayerState } from '../../data/player';
import { sound } from '../../utils/soundManager';

interface PlayerHUDProps {
  player: PlayerState;
  onCoinsClick?: () => void;
  onBackpackClick?: () => void;
  onStreakClick?: () => void;
  className?: string;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  player,
  onCoinsClick,
  onBackpackClick,
  onStreakClick,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* 1. Duolingo-style Огненная серия (Streak) */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sound.playClick();
          if (onStreakClick) onStreakClick();
        }}
        className="hidden sm:flex bg-white rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 items-center gap-1.5 border-2 border-orange-200 border-b-4 border-b-orange-400 hover:bg-orange-50/50 cursor-pointer select-none transition-all active:translate-y-0.5 active:border-b-2 shadow-xs"
        title="Серия дней активности: 5 дней подряд!"
        id="hud-streak"
      >
        <span className="text-base sm:text-lg leading-none">🔥</span>
        <span className="text-sm sm:text-base font-black text-[#EA580C] tracking-tight">
          5
        </span>
      </motion.button>

      {/* 2. Монеты */}
      <CoinCounter coins={player.coins} onClick={onCoinsClick} />

      {/* 3. Рюкзак */}
      <BackpackCounter itemCount={player.inventory.length} onClick={onBackpackClick} />
    </div>
  );
};
