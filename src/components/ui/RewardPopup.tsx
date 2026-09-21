// src/components/ui/RewardPopup.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerState } from '../../data/player';

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  modalType: 'coins' | 'backpack';
}

export const RewardPopup: React.FC<RewardPopupProps> = ({
  isOpen,
  onClose,
  player,
  modalType
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#52D2CC]/40 relative text-[#17345F]"
          >
            {/* Кнопка закрытия */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors"
            >
              ✕
            </button>

            {modalType === 'coins' ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg viewBox="0 0 44 44" className="w-full h-full filter drop-shadow-lg" fill="none">
                    <circle cx="22" cy="22" r="20" fill="#F59E0B" />
                    <circle cx="22" cy="22" r="16" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
                    <polygon
                      points="22,12 25,18 31,19 26.5,23.5 28,30 22,26.5 16,30 17.5,23.5 13,19 19,18"
                      fill="#F59E0B"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black mb-1">Твоя казна</h3>
                <p className="text-4xl font-black text-amber-500 mb-3">{player.coins} монет</p>
                <p className="text-sm font-semibold text-slate-500 mb-6">
                  Зарабатывай монеты за выполнение UX/UI заданий на островах Мари, Кирилла и Сони!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Отлично!
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-2 text-4xl flex items-center justify-center bg-purple-100 rounded-2xl">
                    🎒
                  </div>
                  <h3 className="text-2xl font-black">Рюкзак исследователя</h3>
                  <p className="text-sm font-semibold text-slate-500">
                    Собрано предметов: {player.inventory.length}
                  </p>
                </div>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                  {player.inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5"
                    >
                      <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-extrabold text-[#17345F] text-base">{item.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Закрыть рюкзак
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
