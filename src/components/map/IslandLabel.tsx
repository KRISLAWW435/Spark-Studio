// src/components/map/IslandLabel.tsx
import React from 'react';

interface IslandLabelProps {
  title: string;
  className?: string;
}

export const IslandLabel: React.FC<IslandLabelProps> = ({ title, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center px-4 py-1.5 sm:px-5 sm:py-2 bg-white rounded-full shadow-lg border-2 border-white/90 select-none whitespace-nowrap transition-transform duration-200 ${className}`}
      style={{
        boxShadow: '0 8px 16px -2px rgba(23, 52, 95, 0.18), 0 2px 6px rgba(23, 52, 95, 0.08)'
      }}
    >
      <span className="text-base sm:text-lg font-black tracking-tight text-[#17345F]">
        {title}
      </span>
    </div>
  );
};
