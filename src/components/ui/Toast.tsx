// src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastData {
  id: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'lock';
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto px-6 py-3.5 rounded-2xl shadow-2xl border-2 flex items-center gap-3 select-none ${
              toast.type === 'lock'
                ? 'bg-[#17345F] text-white border-amber-400/50'
                : toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-300/60'
                : 'bg-white text-[#17345F] border-white/80'
            }`}
            style={{
              boxShadow: '0 16px 36px -4px rgba(23, 52, 95, 0.28)'
            }}
          >
            {toast.type === 'lock' && (
              <span className="text-xl">🔒</span>
            )}
            {toast.type === 'success' && (
              <span className="text-xl">⭐</span>
            )}
            <span className="font-extrabold text-base sm:text-lg tracking-tight">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
