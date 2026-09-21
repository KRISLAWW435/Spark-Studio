// src/data/player.ts

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PlayerState {
  coins: number;
  inventory: InventoryItem[];
  currentIsland: string;
  completedIslands: string[];
  unlockedIslands: string[];
}

export const INITIAL_PLAYER: PlayerState = {
  coins: 120,
  inventory: [
    {
      id: 'cup',
      name: 'Чашка Мари',
      icon: '☕',
      description: 'Удобная чашка, напоминающая о комфорте пользователя.'
    },
    {
      id: 'ruler',
      name: 'Пиксельная линейка',
      icon: '📐',
      description: 'Инструмент для проверки расстояний и размера кнопок.'
    }
  ],
  currentIsland: 'marie',
  completedIslands: [],
  unlockedIslands: ['marie', 'kirill', 'sonya']
};
