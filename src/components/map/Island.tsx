// src/components/map/Island.tsx
import React from 'react';
import { motion } from 'motion/react';
import { IslandData } from '../../data/islands';
import { IslandBase } from './IslandBase';
import { IslandShadow } from './IslandShadow';
import { IslandDecor } from './IslandDecor';
import { IslandBuilding } from './IslandBuilding';
import { IslandAvatar } from './IslandAvatar';
import { IslandLabel } from './IslandLabel';
import { LockBadge } from './LockBadge';

interface IslandProps {
  data: IslandData;
  isSelected: boolean;
  onSelect: (island: IslandData) => void;
}

export const Island: React.FC<IslandProps> = ({
  data,
  isSelected,
  onSelect
}) => {
  const isLocked = data.state === 'locked';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${data.x - 160}px`,
        top: `${data.y - 120}px`,
        width: '320px',
        height: '240px'
      }}
      className="select-none flex flex-col items-center justify-center cursor-pointer group"
      onClick={() => onSelect(data)}
      id={`island-${data.id}`}
    >
      {/* 1. Статичная тень острова на поверхности океана (без анимаций и смещений) */}
      <div className="absolute top-[180px] pointer-events-none">
        <IslandShadow width={260} height={60} />
      </div>

      {/* 2. Остров (без анимаций translate и rotate, только легкий scale при hover) */}
      <motion.div
        className="relative w-[300px] h-[200px] flex items-center justify-center"
        whileHover={{
          scale: 1.04,
          transition: { duration: 0.15, ease: 'easeOut' }
        }}
        whileTap={{
          scale: 0.98
        }}
      >
        {/* Кольцо фокуса/выбора */}
        {isSelected && (
          <div className="absolute inset-0 -m-4 rounded-full border-4 border-white/80 pointer-events-none shadow-[0_0_25px_rgba(255,255,255,0.7)]" />
        )}

        {/* Форма острова (скала и травянистое плато) */}
        <IslandBase theme={data.theme} width={300} height={200} />

        {/* Растительность и декор */}
        <IslandDecor theme={data.theme} />

        {/* Здания и объекты */}
        <IslandBuilding theme={data.theme} />

        {/* Центральный персонаж или Замок */}
        {isLocked ? (
          <div className="absolute top-[75px] flex items-center justify-center filter drop-shadow-xl">
            <LockBadge size={92} variant="gold" />
          </div>
        ) : (
          data.character && (
            <div className="absolute top-[80px] flex items-center justify-center filter drop-shadow-lg">
              <IslandAvatar character={data.character} size={90} />
            </div>
          )
        )}
      </motion.div>

      {/* 3. Плашка с названием острова (без translate) */}
      <div className="relative -mt-2 z-10 filter drop-shadow-md">
        <IslandLabel title={data.title} />
      </div>
    </div>
  );
};
