// src/components/SparkMascotV3.tsx
import { SparkFlameCore, SparkEmotionType } from './common/SparkFlameCore';

export type SparkEmotion = 'happy' | 'thinking' | 'sleeping' | 'excited' | 'idle';

interface SparkMascotV3Props {
  emotion: SparkEmotion;
  size?: number; // default 120
  className?: string;
  isSpeaking?: boolean;
}

export function SparkMascotV3({
  emotion = 'idle',
  size = 120,
  className,
  isSpeaking = false,
}: SparkMascotV3Props) {
  return (
    <SparkFlameCore
      emotion={emotion as SparkEmotionType}
      size={size}
      className={className}
      isSpeaking={isSpeaking}
      waving={emotion === 'happy' || emotion === 'excited' || emotion === 'idle'}
    />
  );
}
