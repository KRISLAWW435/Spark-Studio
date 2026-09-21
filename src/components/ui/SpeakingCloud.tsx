import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSpeech } from '../../hooks/useSpeech';

export interface SpeakingCloudProps {
  text: string;
  speechText?: string;
  isVisible?: boolean;
  className?: string;
  position?: 'top' | 'bottom';
  autoSpeakOnMount?: boolean;
  onSpeakStart?: () => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const SpeakingCloud: React.FC<SpeakingCloudProps> = ({
  text,
  speechText,
  isVisible = true,
  className,
  position = 'top',
  autoSpeakOnMount = false,
  onSpeakStart,
  onSpeakingChange
}) => {
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  React.useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);

  React.useEffect(() => {
    if (autoSpeakOnMount && isVisible && text) {
      speak(speechText || text);
      onSpeakStart?.();
    }
  }, [autoSpeakOnMount, isVisible, text, speechText, speak, onSpeakStart]);

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(speechText || text);
      onSpeakStart?.();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.92 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: isSpeaking ? [1, 1.03, 1] : 1
          }}
          exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 6 : -6 }}
          transition={{
            scale: isSpeaking
              ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.25, ease: 'easeOut' },
            opacity: { duration: 0.2 }
          }}
          onClick={handleToggleSpeak}
          title="Нажми, чтобы Спарк озвучил фразу"
          className={cn(
            "relative pointer-events-auto bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-xl border border-amber-200/80 text-slate-800 cursor-pointer select-none group transition-shadow hover:shadow-2xl",
            position === 'top' 
              ? "after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:border-x-[8px] after:border-x-transparent after:border-t-[10px] after:border-t-amber-200/80 before:content-[''] before:absolute before:-bottom-[8px] before:left-1/2 before:-translate-x-1/2 before:border-x-[7px] before:border-x-transparent before:border-t-[9px] before:border-t-white before:z-10"
              : "after:content-[''] after:absolute after:-top-2.5 after:left-1/2 after:-translate-x-1/2 after:border-x-[8px] after:border-x-transparent after:border-b-[10px] after:border-b-amber-200/80 before:content-[''] before:absolute before:-top-[8px] before:left-1/2 before:-translate-x-1/2 before:border-x-[7px] before:border-x-transparent before:border-b-[9px] before:border-b-white before:z-10",
            className
          )}
        >
          <div className="flex items-start gap-2.5">
            <div className="flex-1 text-xs sm:text-sm font-semibold leading-snug text-slate-700 text-left">
              {text}
            </div>

            {isSupported && (
              <button
                type="button"
                onClick={handleToggleSpeak}
                aria-label={isSpeaking ? "Остановить озвучку" : "Озвучить Спарком"}
                className={cn(
                  "shrink-0 p-1.5 rounded-xl border transition-all duration-200 flex items-center justify-center",
                  isSpeaking
                    ? "bg-amber-500 text-white border-amber-600 shadow-md animate-pulse"
                    : "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500"
                )}
              >
                {isSpeaking ? (
                  <VolumeX size={14} strokeWidth={2.5} />
                ) : (
                  <Volume2 size={14} strokeWidth={2.5} />
                )}
              </button>
            )}
          </div>

          {/* Индикатор речи */}
          {isSpeaking && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center justify-center gap-1.5 mt-2 pt-1.5 border-t border-amber-100 text-[10px] font-bold text-amber-600"
            >
              <Sparkles size={11} className="animate-spin text-amber-500" />
              <span>Спарк говорит...</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
