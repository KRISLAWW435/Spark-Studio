// src/components/navigation/BottomNavigation.tsx
import React from 'react';
import { NavigationTab, NavigationTabItem } from './NavigationTab';

interface BottomNavigationProps {
  currentIslandId: string;
  onSelectIsland: (islandId: string) => void;
  className?: string;
}

const NAV_ITEMS: NavigationTabItem[] = [
  {
    id: 'marie',
    label: 'Кофе',
    theme: 'orange',
    iconType: 'marie'
  },
  {
    id: 'kirill',
    label: 'Техно',
    theme: 'teal',
    iconType: 'techno'
  },
  {
    id: 'sonya',
    label: 'Воркшоп',
    theme: 'purple',
    iconType: 'sonya'
  }
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentIslandId,
  onSelectIsland,
  className = ''
}) => {
  return (
    <nav
      className={`bg-white/95 backdrop-blur-xs rounded-3xl p-2 sm:p-3 shadow-lg border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] flex items-center gap-2 sm:gap-2.5 pointer-events-auto select-none ${className}`}
      id="bottom-navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavigationTab
          key={item.id}
          item={item}
          isActive={currentIslandId === item.id}
          onClick={() => onSelectIsland(item.id)}
        />
      ))}
    </nav>
  );
};
