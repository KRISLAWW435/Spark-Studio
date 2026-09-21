// src/data/sparkEmotions.ts

export type SparkEmotion =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'excited'
  | 'sad'
  | 'waving'
  | 'sleepy'
  | 'confused'
  | 'proud'
  | 'surprised'
  | 'playful';

export interface SparkEmotionConfig {
  type: 'vector' | 'image';
  mode?: 'full' | 'waving' | 'silhouette';
  src?: string; // путь к PNG/WebP для будущей замены
  label: string;
  description: string;
  particleEffect?: 'sparkles' | 'stars' | 'bubbles' | 'question' | 'zzz' | 'hearts' | 'none';
  bounceIntensity?: 'none' | 'gentle' | 'energetic';
}

export const SPARK_EMOTION_CONFIG: Record<SparkEmotion, SparkEmotionConfig> = {
  idle: {
    type: 'vector',
    mode: 'full',
    label: 'Спокойный',
    description: 'Спарк мягко покачивается и внимательно наблюдает',
    particleEffect: 'sparkles',
    bounceIntensity: 'gentle'
  },
  happy: {
    type: 'vector',
    mode: 'full',
    label: 'Счастливый',
    description: 'Спарк сияет от радости, глазки-полумесяцы и румянец',
    particleEffect: 'sparkles',
    bounceIntensity: 'energetic'
  },
  thinking: {
    type: 'vector',
    mode: 'full',
    label: 'Задумчивый',
    description: 'Спарк размышляет над задачей и прикидывает варианты',
    particleEffect: 'question',
    bounceIntensity: 'gentle'
  },
  excited: {
    type: 'vector',
    mode: 'full',
    label: 'Восторженный',
    description: 'Огонь пылает ярче, в глазах горят звездочки открытий',
    particleEffect: 'stars',
    bounceIntensity: 'energetic'
  },
  sad: {
    type: 'vector',
    mode: 'full',
    label: 'Огорчённый',
    description: 'Спарк немного расстроился, но готов пробовать снова',
    particleEffect: 'none',
    bounceIntensity: 'none'
  },
  waving: {
    type: 'vector',
    mode: 'waving',
    label: 'Приветливый',
    description: 'Спарк радостно машет ручкой игроку',
    particleEffect: 'sparkles',
    bounceIntensity: 'gentle'
  },
  sleepy: {
    type: 'vector',
    mode: 'full',
    label: 'Сонный',
    description: 'Спарк задремал, пока игра стояла на паузе',
    particleEffect: 'zzz',
    bounceIntensity: 'none'
  },
  confused: {
    type: 'vector',
    mode: 'full',
    label: 'Озадаченный',
    description: 'Спарк удивлён нестыковкой в интерфейсе',
    particleEffect: 'question',
    bounceIntensity: 'gentle'
  },
  proud: {
    type: 'vector',
    mode: 'full',
    label: 'Гордый',
    description: 'Спарк гордится успехами своего юного дизайнера',
    particleEffect: 'stars',
    bounceIntensity: 'energetic'
  },
  surprised: {
    type: 'vector',
    mode: 'full',
    label: 'Удивлённый',
    description: 'Ого! Спарк увидел что-то неожиданно крутое',
    particleEffect: 'sparkles',
    bounceIntensity: 'energetic'
  },
  playful: {
    type: 'vector',
    mode: 'full',
    label: 'Игривый',
    description: 'Спарк подмигивает и приглашает к творчеству',
    particleEffect: 'hearts',
    bounceIntensity: 'gentle'
  }
};
