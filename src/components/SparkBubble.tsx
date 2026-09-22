// src/components/SparkBubble.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { useResponsiveLayout, LayoutSize } from '../hooks/useResponsiveLayout';

export interface SparkBubbleProps {
  /** Текст реплики Спарка */
  message: string;
  /** Принудительный лейаут (если не передан, определяется автоматически через useResponsiveLayout) */
  layout?: LayoutSize;
  /** Обработчик клика по облачку */
  onClick?: () => void;
  /** Флаг выключенного звука */
  isMuted?: boolean;
  /** Обработчик клика по иконке звука/Mute */
  onToggleMute?: (e: React.MouseEvent) => void;
  /** Показывать ли иконку звука (по умолчанию true) */
  showVoiceIcon?: boolean;
  /** Дополнительные CSS классы для внешнего контейнера */
  className?: string;
  /** Пользовательские inline стили (переопределяют стандартные координаты) */
  style?: React.CSSProperties;
}

export interface BubbleResolutionConfig {
  maxWidth: string;
  padding: string;
  textSize: string;
  tailWidth: string;
  tailHeight: string;
  tailClass: string;
  iconSize: number;
  defaultPosition: React.CSSProperties;
}

export const BUBBLE_CONFIGS: Record<LayoutSize, BubbleResolutionConfig> = {
  desktop: {
    maxWidth: 'max-w-[380px]',
    padding: 'px-5 py-4',
    textSize: 'text-base leading-relaxed',
    tailWidth: '14px',
    tailHeight: '20px',
    tailClass: 'w-3.5 h-5',
    iconSize: 16,
    defaultPosition: {
      right: '28%',
      top: '42%',
      transform: 'translateY(-50%)',
    },
  },
  tablet: {
    maxWidth: 'max-w-[320px]',
    padding: 'px-4 py-3.5',
    textSize: 'text-sm leading-relaxed',
    tailWidth: '12px',
    tailHeight: '16px',
    tailClass: 'w-3 h-4',
    iconSize: 14,
    defaultPosition: {
      right: '20%',
      top: '45%',
      transform: 'translateY(-50%)',
    },
  },
  mobile: {
    maxWidth: 'max-w-[220px]',
    padding: 'px-3.5 py-3',
    textSize: 'text-xs leading-snug',
    tailWidth: '10px',
    tailHeight: '14px',
    tailClass: 'w-2.5 h-3.5',
    iconSize: 12,
    defaultPosition: {
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },
};

export function SparkBubble({
  message,
  layout,
  onClick,
  isMuted = false,
  onToggleMute,
  showVoiceIcon = true,
  className = '',
  style,
}: SparkBubbleProps) {
  const currentLayout = useResponsiveLayout();
  const effectiveLayout = layout || currentLayout;
  const config = BUBBLE_CONFIGS[effectiveLayout];

  const mergedStyle: React.CSSProperties = {
    ...config.defaultPosition,
    ...style,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={onClick ? { scale: 1.015 } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.35 }}
      onClick={onClick}
      className={`absolute z-20 select-none overflow-visible ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={mergedStyle}
    >
      <div className="relative inline-block overflow-visible">
        {/* Хвостик — SVG, снаружи */}
        <svg
          className={`absolute -left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none ${config.tailClass}`}
          viewBox="0 0 12 16"
          style={{
            width: config.tailWidth,
            height: config.tailHeight,
          }}
        >
          <path d="M 12 0 L 0 8 L 12 16 Z" fill="white" />
        </svg>

        {/* Облачко — контент внутри */}
        <div
          className={`bg-white rounded-2xl ${config.padding} shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 ${config.maxWidth} relative overflow-hidden`}
        >
          <div className="flex items-center min-h-[24px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className={`text-slate-800 font-medium [text-wrap:balance] break-words ${config.textSize} ${
                  showVoiceIcon ? 'pr-6' : ''
                }`}
              >
                {message}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Иконка 🔊 (mute / voice) в правом нижнем углу */}
          {showVoiceIcon && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute?.(e);
              }}
              title={isMuted ? 'Включить озвучку' : 'Выключить озвучку'}
              className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 p-1 rounded-full text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors z-20 cursor-pointer"
            >
              {isMuted ? (
                <VolumeX size={config.iconSize} className="text-rose-400 hover:text-rose-600" />
              ) : (
                <Volume2 size={config.iconSize} className="text-purple-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SparkBubble;
