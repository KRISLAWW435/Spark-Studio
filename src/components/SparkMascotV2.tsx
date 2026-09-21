// src/components/SparkMascotV2.tsx
import { SparkFlameCore, SparkEmotionType } from './common/SparkFlameCore';

export type SparkEmotion = 
  | 'idle'       // Спокойно стоит
  | 'happy'      // Машет рукой
  | 'thinking'   // Чешет затылок, думает
  | 'sleeping'   // Спит (для заблокированных)
  | 'excited';   // Прыгает от радости

interface SparkMascotV2Props {
  emotion?: SparkEmotion;
  size?: number;
  colorTheme?: 'fire' | 'blue' | 'purple' | 'ash';
  className?: string;
}

export function SparkMascotV2({ 
  emotion = 'idle', 
  size = 120,
  colorTheme = 'fire',
  className 
}: SparkMascotV2Props) {
  const colorVariant: 'orange' | 'cyan' | 'gray' = 
    colorTheme === 'blue' ? 'cyan' :
    colorTheme === 'ash' ? 'gray' : 'orange';

  return (
    <SparkFlameCore
      emotion={emotion as SparkEmotionType}
      size={size}
      className={className}
      colorVariant={colorVariant}
      waving={emotion === 'happy' || emotion === 'excited' || emotion === 'idle'}
    />
  );
}
