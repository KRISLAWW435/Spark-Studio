// src/components/mascot/SpeechBubble.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpeechBubbleProps {
  message: string;
  className?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ message, className = '' }) => {
  return (
    <div className={`relative select-none ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative bg-white text-[#17345F] rounded-[24px] px-5 py-3.5 shadow-lg border-2 border-[#E2E8F0] border-b-4 border-b-[#CBD5E1] max-w-[280px] sm:max-w-[320px]"
        >
          <p className="text-sm sm:text-base font-extrabold leading-snug whitespace-pre-line text-[#17345F]">
            {message}
          </p>

          {/* Хвостик спичбаббла в стиле Duolingo */}
          <div
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: '12px solid #CBD5E1'
            }}
          />
          <div
            className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '10px solid white'
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
