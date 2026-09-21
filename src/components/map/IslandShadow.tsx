// src/components/map/IslandShadow.tsx
import React from 'react';

interface IslandShadowProps {
  width?: number;
  height?: number;
  className?: string;
}

export const IslandShadow: React.FC<IslandShadowProps> = ({
  width = 240,
  height = 55,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 55"
      className={`select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="120"
        cy="27"
        rx="105"
        ry="22"
        fill="#024D82"
        opacity="0.22"
      />
      <ellipse
        cx="120"
        cy="27"
        rx="70"
        ry="14"
        fill="#024D82"
        opacity="0.15"
      />
    </svg>
  );
};
