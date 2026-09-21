// src/data/islands.ts

export type IslandTheme = 'orange' | 'teal' | 'purple' | 'blue';
export type IslandState = 'available' | 'locked' | 'completed';
export type CharacterId = 'marie' | 'kirill' | 'sonya';

export interface IslandData {
  id: string;
  title: string;
  subtitle: string;
  character?: CharacterId;
  theme: IslandTheme;
  state: IslandState;
  x: number;
  y: number;
  reward: number;
  nextIsland: string | null;
  tasksCount?: number;
}

export const ISLANDS: IslandData[] = [
  {
    id: 'marie',
    title: 'Кофейня Мари',
    subtitle: 'Основы UX',
    character: 'marie',
    theme: 'orange',
    state: 'available',
    x: 380,
    y: 430,
    reward: 30,
    nextIsland: 'kirill',
    tasksCount: 2
  },
  {
    id: 'kirill',
    title: 'Техно-хаб Кирилла',
    subtitle: 'Закон Фиттса',
    character: 'kirill',
    theme: 'teal',
    state: 'available',
    x: 800,
    y: 250,
    reward: 40,
    nextIsland: 'sonya',
    tasksCount: 2
  },
  {
    id: 'sonya',
    title: 'Мастерская Сони',
    subtitle: 'Типографика',
    character: 'sonya',
    theme: 'purple',
    state: 'available',
    x: 1200,
    y: 380,
    reward: 50,
    nextIsland: 'metropolis',
    tasksCount: 2
  },
  {
    id: 'metropolis',
    title: 'Мегаполис',
    subtitle: 'Финальный проект',
    theme: 'blue',
    state: 'locked',
    x: 800,
    y: 620,
    reward: 100,
    nextIsland: null,
    tasksCount: 4
  }
];
