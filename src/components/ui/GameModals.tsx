// src/components/ui/GameModals.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayer } from '../../context/PlayerContext';
import { sound } from '../../utils/soundManager';

export const GameModals: React.FC = () => {
  const { player, userName, studioName, level, activeModal, closeModal, setPlayer, exportSaveKey } = usePlayer();
  const [isSoundMuted, setIsSoundMuted] = useState(() => sound.isSoundMuted());

  if (!activeModal) return null;

  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const handleResetProgress = () => {
    sound.playClick();
    if (window.confirm('Сбросить весь игровой прогресс и монеты?')) {
      setPlayer({
        coins: 120,
        inventory: [
          {
            id: 'cup',
            name: 'Чашка Мари',
            icon: '☕',
            description: 'Удобная чашка, напоминающая о комфорте пользователя.'
          },
          {
            id: 'ruler',
            name: 'Пиксельная линейка',
            icon: '📐',
            description: 'Инструмент для проверки расстояний и размера кнопок.'
          }
        ],
        currentIsland: 'marie',
        completedIslands: [],
        unlockedIslands: ['marie', 'kirill', 'sonya']
      });
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={closeModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white rounded-[32px] p-6 sm:p-7 max-w-md w-full shadow-2xl border-4 border-[#F3E5C7] border-b-8 border-b-[#E5D5BA] z-10 text-[#17345F]"
          id="game-active-modal"
        >
          {/* Кнопка закрытия в стиле Duolingo */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              closeModal();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-[#FFF9EA] hover:bg-[#F3E5C7] border-2 border-[#EADBBD] border-b-4 border-b-[#D4C3A3] flex items-center justify-center text-sm font-black text-[#17345F] transition-all cursor-pointer shadow-xs active:translate-y-0.5 active:border-b-2"
            aria-label="Закрыть"
          >
            ✕
          </button>

          {/* 1. Модалка Монет */}
          {activeModal === 'coins' && (
            <div className="text-center pt-2">
              <div className="w-20 h-20 mx-auto mb-3 relative">
                <svg viewBox="0 0 44 44" className="w-full h-full filter drop-shadow-md" fill="none">
                  <circle cx="22" cy="22" r="20" fill="#F59E0B" />
                  <circle cx="22" cy="22" r="16" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
                  <polygon
                    points="22,12 25,18 31,19 26.5,23.5 28,30 22,26.5 16,30 17.5,23.5 13,19 19,18"
                    fill="#F59E0B"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-1 text-[#17345F]">Казна игрока</h3>
              <p className="text-4xl font-black text-amber-500 mb-2">💰 {player.coins}</p>
              <p className="text-sm font-bold text-slate-500 mb-6 leading-relaxed">
                Зарабатывай золотые монеты за выполнение практических UX-заданий у Мари, Кирилла и Сони!
              </p>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  closeModal();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl font-black text-base uppercase tracking-wider border-2 border-amber-500 border-b-4 border-b-amber-700 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-sm"
              >
                Понятно!
              </button>
            </div>
          )}

          {/* 2. Модалка Рюкзака */}
          {activeModal === 'backpack' && (
            <div className="pt-2">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-[#F3E8FF] rounded-2xl border-2 border-[#C084FC] border-b-4 border-b-[#7E22CE] shadow-xs">
                  <svg viewBox="0 0 36 36" className="w-10 h-10" fill="none">
                    <rect x="7" y="8" width="22" height="23" rx="7" fill="#9361E8" stroke="#581C87" strokeWidth="1.2" />
                    <rect x="10" y="18" width="16" height="11" rx="3.5" fill="#7E22CE" stroke="#3B0764" strokeWidth="1" />
                    <line x1="12" y1="21" x2="24" y2="21" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="10" y="9" width="2.5" height="8" rx="1.2" fill="#FB923C" />
                    <rect x="23.5" y="9" width="2.5" height="8" rx="1.2" fill="#FB923C" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#17345F]">Рюкзак дизайнера</h3>
                <p className="text-xs font-bold text-slate-400">
                  Собрано артефактов: {player.inventory.length}
                </p>
              </div>

              <div className="space-y-2.5 mb-5 max-h-60 overflow-y-auto pr-1">
                {player.inventory.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 font-bold text-sm">
                    Рюкзак пуст. Исследуй острова, чтобы получить полезные вещи!
                  </div>
                ) : (
                  player.inventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] flex items-center gap-3 shadow-xs"
                    >
                      <span className="text-2xl p-2 bg-[#FFF9EA] rounded-xl border border-[#F3E5C7]">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-[#17345F] text-sm truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 font-semibold line-clamp-2 leading-tight mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  closeModal();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-black text-base uppercase tracking-wider border-2 border-purple-600 border-b-4 border-b-purple-800 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-sm"
              >
                Закрыть рюкзак
              </button>
            </div>
          )}

          {/* 3. Модалка Профиля */}
          {activeModal === 'profile' && (
            <div className="pt-2">
              <div className="text-center mb-4">
                <div className="w-18 h-18 mx-auto mb-2 rounded-full bg-gradient-to-tr from-[#FF9600] to-[#52D2CC] p-1 shadow-sm border-2 border-white">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl font-black text-[#FF9600]">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-[#17345F]">{userName}</h3>
                <span className="inline-block mt-1 px-3 py-1 rounded-2xl bg-[#CCFBF1] text-[#0F766E] border-2 border-[#5EEAD4] border-b-4 border-b-[#0D9488] text-xs font-black uppercase tracking-wider">
                  Уровень 3 • UX Исследователь
                </span>
              </div>

              {/* 4 карточки статистики в стиле Duolingo */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] text-center shadow-xs">
                  <span className="text-xl">💰</span>
                  <div className="text-base font-black text-[#17345F] mt-0.5">{player.coins}</div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase">Монеты</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] text-center shadow-xs">
                  <span className="text-xl">🎒</span>
                  <div className="text-base font-black text-[#17345F] mt-0.5">{player.inventory.length}</div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase">Предметы</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] text-center shadow-xs">
                  <span className="text-xl">🏝️</span>
                  <div className="text-base font-black text-[#17345F] mt-0.5">3 / 4</div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase">Острова</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] text-center shadow-xs">
                  <span className="text-xl">🔥</span>
                  <div className="text-base font-black text-[#17345F] mt-0.5">5 дней</div>
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase">Серия</div>
                </div>
              </div>

              {/* Кнопка скачать ключ сохранения */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    exportSaveKey();
                  }}
                  className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] rounded-2xl font-black text-sm uppercase tracking-wider border-2 border-purple-200 border-b-4 border-b-purple-300 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔑 Скачать ключ (.spark)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  closeModal();
                }}
                className="w-full py-3.5 bg-[#17345F] hover:bg-[#1E427B] text-white rounded-2xl font-black text-base uppercase tracking-wider border-2 border-[#0F223D] border-b-4 border-b-[#0A1729] active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-sm"
              >
                Отлично
              </button>
            </div>
          )}

          {/* 4. Модалка Достижений */}
          {activeModal === 'achievements' && (
            <div className="pt-2">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-[#FEF3C7] rounded-2xl border-2 border-[#FCD34D] border-b-4 border-b-[#B45309] text-3xl">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-[#17345F]">Достижения</h3>
                <p className="text-xs font-bold text-slate-400">Твои знаки отличия</p>
              </div>

              <div className="space-y-2.5 mb-5 max-h-60 overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-white border-2 border-amber-300 border-b-4 border-b-amber-500 flex items-center gap-3 shadow-xs">
                  <span className="text-2xl">⭐</span>
                  <div className="flex-1">
                    <div className="font-black text-[#17345F] text-sm">Первооткрыватель UX</div>
                    <div className="text-xs text-slate-500 font-semibold">Высадиться на Архипелаг UX</div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-xl uppercase">
                    Получено
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-orange-300 border-b-4 border-b-orange-500 flex items-center gap-3 shadow-xs">
                  <span className="text-2xl">☕</span>
                  <div className="flex-1">
                    <div className="font-black text-[#17345F] text-sm">Кофеман Мари</div>
                    <div className="text-xs text-slate-500 font-semibold">Посетить европейскую кофейню UX</div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-xl uppercase">
                    Получено
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border-2 border-teal-300 border-b-4 border-b-teal-500 flex items-center gap-3 shadow-xs">
                  <span className="text-2xl">💻</span>
                  <div className="flex-1">
                    <div className="font-black text-[#17345F] text-sm">Техно-гуру Кирилла</div>
                    <div className="text-xs text-slate-500 font-semibold">Исследовать рабочее место с мониторами</div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-xl uppercase">
                    Получено
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-300 flex items-center gap-3 opacity-60">
                  <span className="text-2xl">🏙️</span>
                  <div className="flex-1">
                    <div className="font-black text-[#17345F] text-sm">Покоритель Мегаполиса</div>
                    <div className="text-xs text-slate-500 font-semibold">Открыть финальный остров небоскребов</div>
                  </div>
                  <span className="text-xs font-black text-slate-500 bg-slate-200 px-2 py-0.5 rounded-xl uppercase">
                    🔒 Заперто
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  closeModal();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-black text-base uppercase tracking-wider border-2 border-amber-600 border-b-4 border-b-amber-800 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-sm"
              >
                Закрыть
              </button>
            </div>
          )}

          {/* 5. Модалка Настроек */}
          {activeModal === 'settings' && (
            <div className="pt-2">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-slate-100 rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 text-3xl">
                  ⚙️
                </div>
                <h3 className="text-2xl font-black text-[#17345F]">Настройки</h3>
                <p className="text-xs font-bold text-slate-400">Управление звуком и игрой</p>
              </div>

              <div className="space-y-3 mb-5">
                {/* Звуковые эффекты */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{isSoundMuted ? '🔇' : '🔊'}</span>
                    <div>
                      <div className="font-black text-[#17345F] text-sm">Звуковые эффекты</div>
                      <div className="text-xs text-slate-500 font-semibold">Клики, награды и анимации</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSound}
                    className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer border-2 border-b-4 ${
                      isSoundMuted
                        ? 'bg-slate-300 border-slate-400 border-b-slate-500'
                        : 'bg-[#52D2CC] border-[#27B2AD] border-b-[#0F766E]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                        isSoundMuted ? 'left-1' : 'right-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Графика / FPS */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5D5BA] border-b-4 border-b-[#D4C3A3] flex items-center justify-between shadow-xs">
                  <div>
                    <div className="font-black text-[#17345F] text-sm">Графика</div>
                    <div className="text-xs text-slate-500 font-semibold">Плавные анимации и эффекты</div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-xl uppercase">
                    60 FPS
                  </span>
                </div>

                {/* Скачать ключ сохранения */}
                <div className="p-3.5 rounded-2xl bg-[#F5F3FF] border-2 border-[#DDD6FE] border-b-4 border-b-[#C4B5FD] flex items-center justify-between shadow-xs">
                  <div>
                    <div className="font-black text-[#7C3AED] text-sm">Скачать ключ (.spark)</div>
                    <div className="text-xs text-slate-500 font-semibold">Файл сохранения для переноса прогресса</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      exportSaveKey();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs uppercase border-2 border-[#6D28D9] border-b-4 border-b-[#4C1D95] active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer"
                  >
                    Скачать
                  </button>
                </div>

                {/* Сброс прогресса */}
                <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 border-b-4 border-b-rose-300 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="font-black text-rose-800 text-sm">Сбросить прогресс</div>
                    <div className="text-xs text-rose-500 font-semibold">Вернуть монеты и острова в начало</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase border-2 border-rose-700 border-b-4 border-b-rose-900 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer"
                  >
                    Сброс
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  closeModal();
                }}
                className="w-full py-3.5 bg-slate-700 hover:bg-slate-800 text-white rounded-2xl font-black text-base uppercase tracking-wider border-2 border-slate-800 border-b-4 border-b-slate-950 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-sm"
              >
                Сохранить
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
