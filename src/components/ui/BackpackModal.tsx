// src/components/ui/BackpackModal.tsx
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Coins, Package, CheckCircle2 } from 'lucide-react';
import { InventoryItem, PlayerWorldState } from '../../data/worldMap';
import { GlassCard } from './GlassCard';

interface BackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerWorldState;
}

export function BackpackModal({ isOpen, onClose, playerState }: BackpackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border-b border-amber-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9600] to-[#FFB700] text-white flex items-center justify-center shadow-md shadow-orange-500/20 text-2xl">
                  🎒
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Рюкзак дизайнера
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-extrabold border border-orange-200">
                      Мои работы
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Награды за выполненные задания и артефакты мира
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-transform active:scale-90"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Wallet & Stats Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Баланс монет
                  </div>
                  <div className="text-base font-black text-slate-900">
                    {playerState.coins} монет
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Собрано предметов
                  </div>
                  <div className="text-base font-black text-slate-900">
                    {playerState.backpack.length} шт.
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Твои артефакты и проекты
              </div>

              {playerState.backpack.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package size={40} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">Рюкзак пока пуст</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Выполняй задания у персонажей на карте мира, чтобы получать артефакты!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {playerState.backpack.map((item: InventoryItem) => (
                    <GlassCard
                      key={item.id}
                      className="p-3.5 border border-slate-200 bg-white/90 hover:border-amber-300 transition-all rounded-2xl flex items-start gap-3 shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 text-sm truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                          {item.description}
                        </div>
                        <div className="mt-1.5 text-[10px] font-bold text-amber-700 bg-amber-100/70 inline-block px-2 py-0.5 rounded-md">
                          {item.source}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Закрыть рюкзак
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
