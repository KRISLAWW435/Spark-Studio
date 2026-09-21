// src/components/ui/ProfessionModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { sound } from '../../utils/soundManager';

export interface ProfessionInfo {
  id: 'web' | 'gamedev' | 'graphic' | 'uiux';
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  badge: string;
  shortDesc: string;
  detailedDesc: string;
  tools: string[];
  deliverables: string[];
  imageSrc?: string; // Готово к подстановке PNG картинки в будущем
}

export const PROFESSIONS_DATA: Record<ProfessionInfo['id'], ProfessionInfo> = {
  web: {
    id: 'web',
    title: 'Веб-дизайнер',
    icon: '💻',
    color: '#0284C7',
    borderColor: '#0369A1',
    badge: 'Создатель сайтов',
    shortDesc: 'Вот что делает веб-дизайнер: он создаёт сайты, чтобы людям было удобно.',
    detailedDesc:
      'Веб-дизайнер придумывает внешний вид сайтов: где будет шапка, кнопки покупки, красивые карточки товаров и адаптивное меню для планшетов и смартфонов.',
    tools: ['Figma', 'Браузер', 'HTML & CSS', 'Палитры цветов'],
    deliverables: ['Сайты', 'Интернет-магазины', 'Веб-сервисы', 'Лендинги']
  },
  gamedev: {
    id: 'gamedev',
    title: 'Геймдизайнер',
    icon: '🎮',
    color: '#8B5CF6',
    borderColor: '#6D28D9',
    badge: 'Архитектор миров',
    shortDesc: 'Вот что делает геймдизайнер: он создаёт игры, персонажей и миры, чтобы в них было интересно играть.',
    detailedDesc:
      'Геймдизайнер придумывает правила игры, уровни, физику прыжка героя, механику сбора монет и кристаллов, делая игру по-настоящему захватывающей.',
    tools: ['Unity', 'Unreal Engine', 'Пиксель-арт', 'Дизайн-документ'],
    deliverables: ['Игровые локации', 'Персонажи', 'Интерфейсы игр', 'Квесты и головоломки']
  },
  graphic: {
    id: 'graphic',
    title: 'Графический дизайнер',
    icon: '🎨',
    color: '#F59E0B',
    borderColor: '#B45309',
    badge: 'Мастер стиля и брендов',
    shortDesc: 'Вот что делает графический дизайнер: он создаёт логотипы, плакаты и упаковки, которые притягивают взгляд.',
    detailedDesc:
      'Графический дизайнер передаёт настроение с помощью шрифтов, иллюстраций и гармонии цветов. Он делает упаковки сладостей, крутой мерч и афиши кино.',
    tools: ['Illustrator', 'Photoshop', 'Векторная графика', 'Типографика'],
    deliverables: ['Логотипы', 'Афиши и плакаты', 'Мерч и стикеры', 'Упаковка товаров']
  },
  uiux: {
    id: 'uiux',
    title: 'UI/UX-дизайнер',
    icon: '📱',
    color: '#10B981',
    borderColor: '#059669',
    badge: 'Инженер интерфейсов',
    shortDesc: 'Вот что делает UI/UX-дизайнер: он проектирует экраны мобильных приложений, чтобы каждое нажатие было понятным и приятным.',
    detailedDesc:
      'UX (User Experience) отвечает за то, чтобы приложение решало задачу быстро и без ошибок. А UI (User Interface) делает кнопки сочными, шрифт читаемым, а анимации плавными.',
    tools: ['Figma', 'Прототипы', 'Дизайн-системы', 'UX-исследования'],
    deliverables: ['Мобильные приложения', 'Экраны смартфонов', 'Виджеты', 'Интерактивные кнопки']
  }
};

interface ProfessionModalProps {
  professionId?: ProfessionInfo['id'] | null;
  profession?: ProfessionInfo | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const ProfessionModal: React.FC<ProfessionModalProps> = ({
  professionId,
  profession,
  isOpen = true,
  onClose
}) => {
  if (isOpen === false) return null;
  const targetId = professionId || profession?.id;
  if (!targetId) return null;
  const data = PROFESSIONS_DATA[targetId];
  if (!data) return null;

  // Интерактивные состояния мини-демок
  const [webCart, setWebCart] = React.useState<number>(0);
  const [gameCoins, setGameCoins] = React.useState<number>(1450);
  const [isHeroJumping, setIsHeroJumping] = React.useState<boolean>(false);
  const [graphicLogoTheme, setGraphicLogoTheme] = React.useState<'coffee' | 'spark' | 'rocket'>('spark');
  const [uiuxClicked, setUiuxClicked] = React.useState<boolean>(false);
  const [uiuxLiked, setUiuxLiked] = React.useState<boolean>(false);

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const handleWebBuy = (item: string) => {
    sound.playClick();
    setWebCart((prev) => prev + 1);
  };

  const handleGameJump = () => {
    sound.playClick();
    setIsHeroJumping(true);
    setGameCoins((prev) => prev + 10);
    setTimeout(() => setIsHeroJumping(false), 500);
  };

  const handleUiuxClick = () => {
    sound.playSuccess();
    setUiuxClicked(true);
    setTimeout(() => setUiuxClicked(false), 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs select-none">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="relative bg-white rounded-3xl p-6 sm:p-10 max-w-2xl sm:max-w-3xl w-full shadow-2xl border-4 border-[#F3E5C7] border-b-8 border-b-[#E5D5BA] z-10 text-[#17345F] max-h-[92vh] overflow-y-auto"
          id="profession-modal"
        >
          {/* Кнопка закрыть (крестик) */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 border-b-4 border-b-slate-400 text-slate-700 flex items-center justify-center cursor-pointer transition-all active:translate-y-0.5 active:border-b-2"
            aria-label="Закрыть"
          >
            <X size={22} strokeWidth={2.5} />
          </button>

          {/* Заголовок с иконкой и бейджем */}
          <div className="flex items-center gap-4 mb-5 pr-12">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-xs border-2 border-white"
              style={{ backgroundColor: `${data.color}20`, borderBottom: `4px solid ${data.borderColor}` }}
            >
              {data.icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-black text-[#17345F] leading-tight">
                  {data.title}
                </h3>
              </div>
              <span
                className="inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-white mt-1.5 shadow-xs"
                style={{ backgroundColor: data.color }}
              >
                {data.badge}
              </span>
            </div>
          </div>

          {/* Главное обучающее утверждение */}
          <div
            className="p-4 sm:p-5 rounded-2xl mb-5 font-bold text-base sm:text-lg leading-relaxed border-2"
            style={{
              backgroundColor: `${data.color}15`,
              borderColor: `${data.color}50`,
              color: '#1E293B'
            }}
          >
            <span className="font-black text-slate-900 block mb-1">📌 Суть профессии:</span>
            {data.shortDesc}
          </div>

          {/* Большая иллюстрация / пример работы */}
          <div className="mb-5">
            <span className="text-sm font-black uppercase text-slate-400 tracking-wider block mb-2.5">
              Пример реальной работы:
            </span>

            {/* Контейнер примера */}
            <div className="w-full h-52 sm:h-60 rounded-2xl bg-slate-100 border-2 border-slate-200 border-b-4 border-b-slate-300 overflow-hidden relative flex items-center justify-center">
              {data.imageSrc ? (
                <img
                  src={data.imageSrc}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Интерактивный визуальный макет для профессии */
                <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
                  {/* Веб-дизайнер: Макет браузера с сайтом */}
                  {data.id === 'web' && (
                    <div className="w-full h-full flex flex-col rounded-xl border border-sky-200 bg-white shadow-xs overflow-hidden">
                      <div className="h-7 bg-sky-100 px-3 flex items-center justify-between border-b border-sky-200">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <div className="ml-2 px-3 py-0.5 bg-white rounded-md text-[10px] font-bold text-sky-800 flex items-center gap-1">
                            <span>🔒 spark-studio.ru/shop</span>
                          </div>
                        </div>
                        <div className="text-[11px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                          <span>🛒 Корзина:</span>
                          <span className="text-amber-600 font-extrabold">{webCart}</span>
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-sky-900">Каталог товаров (нажми!)</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Все кликабельно</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5 my-1">
                          {[
                            { emoji: '🧸', name: 'Мишка', bg: 'bg-sky-50', border: 'border-sky-200', btn: 'bg-sky-500' },
                            { emoji: '🚀', name: 'Ракета', bg: 'bg-amber-50', border: 'border-amber-200', btn: 'bg-amber-500' },
                            { emoji: '🎨', name: 'Краски', bg: 'bg-purple-50', border: 'border-purple-200', btn: 'bg-purple-500' }
                          ].map((item, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleWebBuy(item.name)}
                              className={`p-2 rounded-xl ${item.bg} border ${item.border} flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-all`}
                            >
                              <span className="text-2xl">{item.emoji}</span>
                              <span className="text-[10px] font-black text-slate-700 mt-1">{item.name}</span>
                              <span className={`mt-1.5 px-2 py-0.5 ${item.btn} text-white text-[9px] font-black rounded-full shadow-xs`}>
                                + Купить
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="text-[11px] font-bold text-sky-700 text-center">
                          💡 Дизайнер сделал карточки понятными, а кнопки покупки — яркими!
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Геймдизайнер: Макет игрового уровня */}
                  {data.id === 'gamedev' && (
                    <div
                      onClick={handleGameJump}
                      className="w-full h-full flex flex-col rounded-xl border border-purple-200 bg-gradient-to-b from-[#2E1065] to-[#4C1D95] text-white p-3 justify-between shadow-xs relative overflow-hidden cursor-pointer select-none"
                      title="Нажми, чтобы герой подпрыгнул!"
                    >
                      {/* Верхний HUD */}
                      <div className="flex items-center justify-between text-xs font-black z-10">
                        <span className="flex items-center gap-1 text-rose-300">❤️❤️❤️</span>
                        <span className="flex items-center gap-1 text-amber-300 font-extrabold bg-purple-900/80 px-2 py-0.5 rounded-lg border border-purple-700">
                          🪙 {gameCoins}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-800 rounded-lg text-purple-200 text-[10px]">
                          Кликни: Прыжок! 👆
                        </span>
                      </div>
                      {/* Игровой мир */}
                      <div className="relative h-24 w-full flex items-center justify-around z-10">
                        <div className="px-3 py-1 bg-emerald-500 rounded-xl text-sm border-b-2 border-emerald-700 shadow-sm">
                          ✨ 💎
                        </div>
                        <div className="flex flex-col items-center">
                          <motion.span
                            animate={isHeroJumping ? { y: -24, scale: 1.2 } : { y: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                            className="text-3xl select-none"
                          >
                            👾
                          </motion.span>
                          <div className="w-16 h-2 bg-emerald-400 rounded-full border-b border-emerald-600 mt-1" />
                        </div>
                        <div className="px-3 py-1 bg-emerald-500 rounded-xl text-sm border-b-2 border-emerald-700 shadow-sm">
                          ⭐ 🪙
                        </div>
                      </div>
                      {/* Земля */}
                      <div className="w-full h-5 bg-emerald-600 rounded-xl border-t-2 border-emerald-400 z-10 flex items-center justify-center text-[10px] font-black tracking-wider text-emerald-100">
                        Уровень игры: нажми в любое место, чтобы прыгать!
                      </div>
                    </div>
                  )}

                  {/* Графический дизайнер: Логотип и афиша */}
                  {data.id === 'graphic' && (
                    <div className="w-full h-full grid grid-cols-2 gap-2.5 p-1">
                      <div
                        onClick={() => {
                          sound.playClick();
                          setGraphicLogoTheme((prev) => (prev === 'coffee' ? 'spark' : prev === 'spark' ? 'rocket' : 'coffee'));
                        }}
                        className="rounded-xl bg-amber-50 border-2 border-amber-200 p-2.5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-400 transition-all select-none"
                        title="Нажми, чтобы сменить стиль логотипа"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl shadow-sm border-2 border-white">
                          {graphicLogoTheme === 'coffee' ? '☕' : graphicLogoTheme === 'spark' ? '⚡' : '🚀'}
                        </div>
                        <span className="font-black text-xs text-amber-950 mt-1">
                          {graphicLogoTheme === 'coffee' ? '«Кофе & Искра»' : graphicLogoTheme === 'spark' ? '«Студия Энергии»' : '«Старт в Космос»'}
                        </span>
                        <span className="text-[9px] font-bold text-amber-700 uppercase mt-0.5">
                          Кликни сменить стиль 🎨
                        </span>
                      </div>
                      <div className="rounded-xl bg-orange-50 border-2 border-orange-200 p-2.5 flex flex-col justify-between">
                        <div className="px-2 py-0.5 bg-orange-500 text-white rounded text-[9px] font-black uppercase text-center">
                          Постер фестиваля
                        </div>
                        <div className="text-center my-1">
                          <div className="text-base">🎪 ✨ 🎨</div>
                          <span className="text-xs font-black text-orange-950 block mt-0.5">День Дизайна</span>
                        </div>
                        <div className="h-2 w-full bg-orange-300 rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* UI/UX-дизайнер: Макет мобильного экрана */}
                  {data.id === 'uiux' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-52 h-full bg-slate-900 rounded-2xl p-2 flex flex-col justify-between shadow-md border-2 border-slate-700">
                        <div className="w-14 h-1.5 bg-slate-800 rounded-full mx-auto" />
                        <div className="bg-white rounded-xl p-2 flex-1 flex flex-col justify-between my-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-slate-800">Привет, Саша 👋</span>
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setUiuxLiked(!uiuxLiked);
                              }}
                              className="text-xs cursor-pointer p-0.5"
                            >
                              {uiuxLiked ? '❤️' : '🤍'}
                            </button>
                          </div>
                          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                            <span className="text-base">🎧</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-black text-emerald-800">Любимый трек</div>
                              <div className="h-1.5 w-10 bg-slate-300 rounded mt-0.5" />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleUiuxClick}
                            className={`w-full py-1.5 rounded-lg text-white font-black text-[11px] uppercase shadow-xs cursor-pointer active:scale-95 transition-all ${
                              uiuxClicked ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-emerald-500 hover:bg-emerald-600'
                            }`}
                          >
                            {uiuxClicked ? '✓ Нажато! Удобно!' : 'Нажми кнопку! 👆'}
                          </button>
                        </div>
                        <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Подробное описание */}
          <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed mb-5">
            {data.detailedDesc}
          </p>

          {/* Инструменты */}
          <div className="mb-6 flex flex-wrap gap-2">
            {data.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200"
              >
                🛠️ {tool}
              </span>
            ))}
          </div>

          {/* Большая 3D-кнопка «Понятно!» */}
          <button
            type="button"
            onClick={handleClose}
            style={{
              backgroundColor: data.color,
              borderColor: data.borderColor
            }}
            className="w-full py-4 rounded-2xl text-white font-black text-lg uppercase tracking-wider border-2 border-b-4 active:translate-y-1 active:border-b-2 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>Понятно! ✨</span>
            <CheckCircle2 size={22} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
