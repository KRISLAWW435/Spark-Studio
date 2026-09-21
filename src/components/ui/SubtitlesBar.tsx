// src/components/ui/SubtitlesBar.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';

export const SubtitlesBar: React.FC = () => {
  const [subtitleText, setSubtitleText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const handleSpeechChange = (e: Event) => {
      const custom = e as CustomEvent<{ speaking: boolean; text?: string }>;
      setIsSpeaking(Boolean(custom.detail?.speaking));
      if (custom.detail?.speaking && custom.detail?.text) {
        setSubtitleText(custom.detail.text);
      } else if (!custom.detail?.speaking) {
        // Задержка перед скрытием субтитров, чтобы ребёнок успел дочитать последнюю фразу
        const t = setTimeout(() => {
          setSubtitleText('');
        }, 1200);
        return () => clearTimeout(t);
      }
    };

    window.addEventListener('spark-speech-change', handleSpeechChange);
    return () => {
      window.removeEventListener('spark-speech-change', handleSpeechChange);
    };
  }, []);

  if (!subtitleText) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] sm:w-auto pointer-events-none"
      >
        <div className="bg-[#0F172A]/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF9600] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Volume2 size={18} className={isSpeaking ? 'animate-pulse' : ''} />
          </div>
          <p className="text-xs sm:text-sm font-bold leading-snug tracking-wide drop-shadow-xs">
            {subtitleText}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
