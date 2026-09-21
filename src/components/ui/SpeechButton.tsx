// src/components/ui/SpeechButton.tsx
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { speech } from '../../utils/speechManager';

interface SpeechButtonProps {
  text: string;
  className?: string;
  size?: number;
  label?: string;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({
  text,
  className = '',
  size = 18,
  label
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ speaking: boolean; text?: string }>;
      if (custom.detail) {
        setIsSpeaking(custom.detail.speaking && (!custom.detail.text || custom.detail.text.includes(text.slice(0, 20))));
      } else {
        setIsSpeaking(false);
      }
    };

    window.addEventListener('spark-speech-change', handler);
    return () => {
      window.removeEventListener('spark-speech-change', handler);
    };
  }, [text]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      speech.speak(text);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none font-bold text-xs ${
        isSpeaking
          ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse shadow-sm'
          : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#17345F] border-slate-200 shadow-xs'
      } ${className}`}
      title={isSpeaking ? 'Остановить озвучку' : 'Озвучить Спарка (Web Speech API)'}
      aria-label="Озвучить"
    >
      {isSpeaking ? (
        <VolumeX size={size} className="text-amber-700 shrink-0" />
      ) : (
        <Volume2 size={size} className="text-slate-600 hover:text-amber-600 shrink-0" />
      )}
      {label && <span>{label}</span>}
    </motion.button>
  );
};
