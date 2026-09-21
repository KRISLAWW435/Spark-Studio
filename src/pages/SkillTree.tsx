import { useState } from 'react';
import { ArrowRight, Flame, Star, Zap, Lock, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { COURSE_MODULES } from '../data/courseData';
import { usePersistentState } from '../hooks/usePersistentState';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { SparkMascotV3 } from '../components/SparkMascotV3';
import { SpeakingCloud } from '../components/ui/SpeakingCloud';

const MODULE_MASCOT_MESSAGES: Record<string, string> = {
  m0: 'Привет… я Спарк! В этом модуле мы разберемся, как думают пользователи… Погнали?!',
  m1: 'Разберем закон Фиттса! Почему размер и расстояние до кнопки… решают абсолютно всё!',
  m2: 'Построим логичный User Flow… и понятную архитектуру экранов!',
  m3: 'Освоим восьмиточечную сетку… и правильный баланс воздуха в дизайне!',
  m4: 'Изучим шрифтовые пары, модульные шкалы… и анти-слап правила!',
  m5: 'Соберем сочную и доступную палитру… по стандартам WCAG!',
  m6: 'Научимся проектировать под любые экраны… от смартфона до 4K!',
  m7: 'Свяжем компоненты с дизайн-токенами… для дизайн-систем!',
  m8: 'Соберем итоговый проект… в твое мощное продуктовое портфолио!'
};

export function SkillTree() {
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [speakingModuleId, setSpeakingModuleId] = useState<string | null>(null);
  const [progress] = usePersistentState('user_progress_v1', {
    lessons: {} as Record<string, boolean>
  });

  const userName = localStorage.getItem('user_name') || 'Дизайнер';
  const starsCount = (progress.lessons?.['lesson_1_1'] ? 1 : 0) + (progress.lessons?.['lesson_0_1'] ? 1 : 0);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none max-w-5xl mx-auto pb-12">
      {/* Статистика пользователя: чистые белые карточки без неонового шума */}
      <header className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Огонь серии */}
        <GlassCard className="p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF9600] shrink-0 shadow-sm">
              <Flame size={26} className="fill-[#FF9600]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-orange-600">
                Огонь серии
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                3 Дня 🔥
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Опыт (XP) */}
        <GlassCard className="p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
              <Zap size={26} className="fill-purple-600" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-purple-600">
                Опыт (XP)
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                150 XP
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Рейтинг */}
        <GlassCard className="p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
              <Star size={26} className="fill-amber-500" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-extrabold text-amber-600">
                Рейтинг
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                ⭐ {starsCount}/45
              </div>
            </div>
          </div>
        </GlassCard>
      </header>

      {/* Заголовок и приветствие */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#CC7700]">
          <Sparkles size={13} className="text-[#FF9600]" />
          <span>Привет, {userName}! Твой трек обучения</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          Мое обучение
        </h1>
        <p className="text-slate-600 text-sm md:text-base font-medium">
          Осваивай дизайн шаг за шагом в игровой форме.
        </p>
      </div>

      {/* Вертикальный список модулей: широкие горизонтальные карточки друг за другом сверху вниз */}
      <div className="flex flex-col space-y-5 w-full">
        {(() => {
          // Определяем активный (текущий) модуль: первый открытый модуль, который еще не пройден полностью
          let activeFound = false;
          const activeModuleId = COURSE_MODULES.find(mod => {
            let unlocked = false;
            if (mod.id === 'm0') unlocked = true;
            if (mod.id === 'm1' && progress.lessons?.['lesson_0_1']) unlocked = true;
            if (mod.id === 'm2' && progress.lessons?.['lesson_1_2']) unlocked = true;
            if (!unlocked) return false;

            let count = 0;
            mod.lessons.forEach(l => {
              let key = '';
              if (l.id === 'm0-l1') key = 'lesson_0_1';
              if (l.id === 'm1-l1') key = 'lesson_1_1';
              if (l.id === 'm1-l2') key = 'lesson_1_2';
              if (progress.lessons?.[key]) count++;
            });

            const isComplete = mod.lessons.length > 0 && count >= mod.lessons.length;
            if (!isComplete && !activeFound) {
              activeFound = true;
              return true;
            }
            return false;
          })?.id || COURSE_MODULES[0]?.id;

          return COURSE_MODULES.map((mod, index) => {
            // Вычисление статуса открытия модуля
            let isUnlocked = false;
            if (mod.id === 'm0') isUnlocked = true;
            if (mod.id === 'm1' && progress.lessons?.['lesson_0_1']) isUnlocked = true;
            if (mod.id === 'm2' && progress.lessons?.['lesson_1_2']) isUnlocked = true;

            // Подсчет пройденных уроков внутри модуля
            const totalLessons = mod.lessons.length;
            let completedLessonsCount = 0;
            mod.lessons.forEach(l => {
              let key = '';
              if (l.id === 'm0-l1') key = 'lesson_0_1';
              if (l.id === 'm1-l1') key = 'lesson_1_1';
              if (l.id === 'm1-l2') key = 'lesson_1_2';
              if (progress.lessons?.[key]) completedLessonsCount++;
            });

            // Модуль полностью пройден, если все его доступные уроки завершены
            const isCompleted = isUnlocked && totalLessons > 0 && completedLessonsCount >= totalLessons;
            const isCurrent = !isCompleted && isUnlocked && mod.id === activeModuleId;

            // Вычисляем процент прогресса
            const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

            return (
              <GlassCard
                key={mod.id}
                onMouseEnter={() => setHoveredModuleId(mod.id)}
                onMouseLeave={() => setHoveredModuleId(null)}
                className={cn(
                  "w-full p-6 sm:p-8 rounded-3xl transition-all duration-200 relative overflow-hidden",
                  isCurrent
                    ? "bg-cyan-50/50 border-2 border-[#1CB0F6] shadow-md hover:shadow-lg"
                    : "bg-white border border-slate-200 shadow-sm hover:border-slate-300"
                )}
              >
                {/* Бейдж ТЕКУЩИЙ в правом верхнем углу карточки */}
                {isCurrent && (
                  <div className="absolute top-5 right-6 z-30">
                    <span className="bg-[#1CB0F6] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs inline-flex items-center gap-1">
                      <Sparkles size={11} className="fill-white" />
                      <span>ТЕКУЩИЙ</span>
                    </span>
                  </div>
                )}

                {/* Левая колонка: Заголовок, описание, прогресс-бар, кнопка действия */}
                <div className="flex flex-col space-y-3.5 max-w-xl pr-28 sm:pr-48 md:pr-64 lg:pr-72 relative z-10">
                  {/* Бейдж главы и счетчик уроков */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Глава {index}
                    </span>
                    {totalLessons > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        <BookOpen size={13} /> {completedLessonsCount}/{totalLessons} уроков
                      </span>
                    )}
                  </div>

                  {/* Заголовок модуля (крупный, text-2xl font-black) */}
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {mod.title}
                  </h2>

                  {/* Описание модуля (text-sm text-slate-500) */}
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Прогресс-бар (h-4 bg-slate-100 rounded-full) */}
                  <div className="w-full max-w-md pt-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5">
                      <span>Прогресс</span>
                      <span className="font-extrabold text-slate-700">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isCompleted 
                            ? "bg-[#58CC02]" 
                            : isCurrent 
                            ? "bg-[#FF9600]" 
                            : "bg-slate-300"
                        )}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Кнопки действия: оранжевая для активного, зеленая («Повторить») для пройденного, серая для закрытого */}
                  <div className="pt-2">
                    {isCompleted ? (
                      <Link to={`/module/${mod.id}`}>
                        <button
                          className="h-12 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-sm tracking-wide border-b-4 border-[#388302] active:border-b-0 active:translate-y-1 transition-all duration-150 shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                          title="Открыть тропинку модуля"
                        >
                          <CheckCircle2 size={18} strokeWidth={2.5} />
                          <span>Повторить</span>
                        </button>
                      </Link>
                    ) : isCurrent ? (
                      <Link to={`/module/${mod.id}`}>
                        <NeonButton
                          variant="solid"
                          size="md"
                          className="h-12 px-8 text-sm font-black rounded-2xl whitespace-nowrap"
                          params={`Module: ${mod.id}`}
                        >
                          <span>{completedLessonsCount > 0 ? 'Продолжить' : 'Начать'}</span>
                          <ArrowRight size={16} strokeWidth={2.5} />
                        </NeonButton>
                      </Link>
                    ) : isUnlocked ? (
                      <Link to={`/module/${mod.id}`}>
                        <NeonButton
                          variant="solid"
                          size="md"
                          className="h-12 px-8 text-sm font-black rounded-2xl whitespace-nowrap"
                          params={`Module: ${mod.id}`}
                        >
                          <span>Открыть</span>
                          <ArrowRight size={16} strokeWidth={2.5} />
                        </NeonButton>
                      </Link>
                    ) : (
                      <div className="h-12 px-6 rounded-2xl bg-slate-100 text-slate-400 font-extrabold text-sm tracking-wide border-2 border-slate-200 select-none inline-flex items-center justify-center gap-2 whitespace-nowrap">
                        <Lock size={16} strokeWidth={2.5} />
                        <span>Заблокировано</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Интеграция Маскота: правая часть карточки с отступом от края (pr-8 sm:pr-12) */}
                <div className="absolute -bottom-2 right-2 sm:bottom-0 sm:right-6 md:right-8 z-20 flex flex-col items-center pointer-events-none select-none pr-4 sm:pr-8 md:pr-10">
                  {/* Интерактивное говорящее облачко со Спарком */}
                  <div className="hidden sm:block relative mb-3 pointer-events-auto max-w-[250px] sm:max-w-[290px]">
                    <SpeakingCloud
                      text={
                        isCompleted 
                          ? 'Глава пройдена! Потрясающе… Отличная работа!' 
                          : (MODULE_MASCOT_MESSAGES[mod.id] || (isCurrent ? 'Твой следующий шаг… Погнали?!' : 'Сплю и жду открытия… Хр-р-р… Zzz'))
                      }
                      isVisible={hoveredModuleId === mod.id || isCurrent}
                      position="top"
                      onSpeakingChange={(speaking) => setSpeakingModuleId(speaking ? mod.id : null)}
                    />
                  </div>

                  {/* Крупный маскот с естественным отступом */}
                  <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                    <SparkMascotV3 
                      size={135}
                      emotion={
                        isCompleted 
                          ? 'happy' 
                          : isCurrent 
                          ? 'thinking' 
                          : 'sleeping'
                      }
                      isSpeaking={speakingModuleId === mod.id}
                      className="scale-95 sm:scale-105 origin-bottom" 
                    />
                  </div>
                </div>

              </GlassCard>
            );
          });
        })()}
      </div>
    </div>
  );
}
