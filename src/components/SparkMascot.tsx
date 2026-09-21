// src/components/SparkMascot.tsx
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SparkFlameCore, SparkEmotionType } from './common/SparkFlameCore';

export type SparkEmotion = 
  | 'neutral' 
  | 'idle' 
  | 'thinking' 
  | 'ecstatic' 
  | 'happy' 
  | 'locked' 
  | 'error' 
  | 'winking' 
  | 'sleeping';

interface SparkMascotProps {
  emotion: SparkEmotion;
  message?: string;
  className?: string;
  colorVariant?: 'orange' | 'cyan' | 'gray';
  size?: number;
}

export function SparkMascot({
  emotion,
  message,
  className,
  colorVariant = 'orange',
  size = 100,
}: SparkMascotProps) {
  useEffect(() => {
    if (emotion === 'ecstatic') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FBBC05', '#EA4335', '#4285F4', '#34A853'],
      });
    }
  }, [emotion]);

  const mappedEmotion: SparkEmotionType = 
    emotion === 'neutral' ? 'idle' :
    emotion === 'error' ? 'locked' :
    (emotion as SparkEmotionType);

  return (
    <SparkFlameCore
      emotion={mappedEmotion}
      message={message}
      className={className}
      colorVariant={colorVariant}
      size={size}
      waving={emotion === 'happy' || emotion === 'ecstatic' || emotion === 'idle'}
    />
  );
}
