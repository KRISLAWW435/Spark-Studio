import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  Play, 
  Lock, 
  Trophy, 
  Sparkles, 
  Star, 
  Flame, 
  Zap, 
  Gift, 
  HelpCircle,
  Award
} from 'lucide-react';
import { COURSE_MODULES } from '../data/courseData';
import { usePersistentState } from '../hooks/usePersistentState';
import { GlassCard } from '../components/ui/GlassCard';
import { SparkMascot } from '../components/SparkMascot';
import { cn } from '../lib/utils';
import { sound } from '../utils/soundManager';

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [progress, setProgress] = usePersistentState('user_progress_v1', {
    lessons: {} as Record<string, boolean>
  });

  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  // Находим выбранный модуль или дефолтный m0
  const currentModule = COURSE_MODULES.find(m => m.id === moduleId) || COURSE_MODULES[0];
  const moduleIndex = COURSE_MODULES.findIndex(m => m.id === currentModule.id);

  // Проверяем прогресс по урокам модуля
  const lessons = currentModule.lessons;
  const totalLessons = lessons.length;

  let completedCount = 0;
  lessons.forEach(lesson => {
    let key = '';
    if (lesson.id === 'm0-l1') key = 'lesson_0_1';
    if (lesson.id === 'm1-l1') key = 'lesson_1_1';
    if (lesson.id === 'm1-l2') key = 'lesson_1_2';
    if (progress.lessons?.[key]) completedCount++;
  });

  const isModuleFinished = totalLessons > 0 && completedCount >= totalLessons;

  // Определение статуса для каждого урока (completed, active, locked)
  // Первый незавершенный урок становится active (текущим)
  let foundFirstUncompleted = false;

  const lessonNodes = lessons.map((lesson, idx) => {
    let key = '';
    if (lesson.id === 'm0-l1') key = 'lesson_0_1';
    if (lesson.id === 'm1-l1') key = 'lesson_1_1';
    if (lesson.id === 'm1-l2') key = 'lesson_1_2';

    const isCompleted = !!progress.lessons?.[key];
    let status: 'completed' | 'active' | 'locked' = 'locked';

    if (isCompleted) {
      status = 'completed';
    } else if (!foundFirstUncompleted) {
      status = 'active';
      foundFirstUncompleted = true;
    } else {
      status = 'locked';
    }

    return {
      ...lesson,
      index: idx,
      status,
      isCompleted
    };
  });

  // Расчет горизонтального смещения змейкой:
  // 0: слева (-70px), 1: центр (0px), 2: справа (+70px), 3: центр (0px), 4: слева (-70px) ...
  const getOffsetClass = (index: number) => {
    const pattern = [
      '-translate-x-16 sm:-translate-x-20', // Слева
      'translate-x-0',                      // По центру
      'translate-x-16 sm:translate-x-20',   // Справа
      'translate-x-0',                      // По центру
    ];
    return pattern[index % pattern.length];
  };

  const handleLessonClick = (node: any) => {
    sound.playClick();
    if (node.status === 'locked') {
      setSelectedLesson({
        ...node,
        message: 'Этот урок пока закрыт. Пройдите предыдущие испытания, чтобы открыть его!'
      });
      return;
    }

    if (node.path && node.path !== '#') {
      navigate(node.path);
    } else {
      setSelectedLesson({
        ...node,
        message: 'Материалы этого урока готовятся методистами Спарк Академии.'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-32 animate-in fade-in duration-200 select-none">
      
      {/* Верхняя навигация и возврат */}
      <div className="flex items-center justify-between">
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 text-sm font-extrabold text-slate-600 hover:text-[#FF9600] transition-colors p-2 rounded-xl hover:bg-slate-100 whitespace-nowrap"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>К списку модулей</span>
        </Link>

        {/* Бейджи статистики */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-black text-[#CC7700]">
            <Flame size={15} className="fill-[#FF9600] text-[#FF9600]" />
            <span>3 дня</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-black text-purple-600">
            <Zap size={15} className="fill-purple-600 text-purple-600" />
            <span>150 XP</span>
          </div>
        </div>
      </div>

      {/* Баннер Главы (В стиле Duolingo) */}
      <GlassCard className="p-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_4px_0_#CC7700]",
              isModuleFinished ? "bg-[#58CC02] shadow-[0_4px_0_#388302]" : "bg-[#FF9600]"
            )}>
              <currentModule.icon size={28} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Глава {moduleIndex >= 0 ? moduleIndex : 0}
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentModule.title}
              </h1>
              <p className="text-sm text-slate-600 font-medium mt-0.5">
                {currentModule.description}
              </p>
            </div>
          </div>

          {/* Прогресс-бар главы */}
          <div className="w-full sm:w-48 shrink-0 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-extrabold text-slate-500">
              <span>Прогресс</span>
              <span className="text-slate-800">{completedCount}/{totalLessons} уроков</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#FF9600] to-[#58CC02] rounded-full transition-all duration-500"
                style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Основной контейнер с извилистой тропинкой уроков */}
      <div className="relative py-8 flex flex-col items-center">
        
        {/* Фоновые пунктирные соединительные линии змейкой */}
        <div className="w-full max-w-md relative flex flex-col items-center space-y-28 sm:space-y-32">
          
          {/* Проходим по каждому уроку тропинки */}
          {lessonNodes.map((node, i) => {
            return (
              <div 
                key={node.id} 
                className={cn(
                  "relative flex flex-col items-center transition-transform",
                  getOffsetClass(i)
                )}
              >
                {/* Соединительная пунктирная линия к следующему элементу */}
                <div 
                  className={cn(
                    "absolute top-20 left-1/2 -translate-x-1/2 w-0 h-28 sm:h-32 border-l-4 border-dashed z-0 pointer-events-none",
                    node.status === 'completed' ? "border-[#58CC02]" : "border-slate-300"
                  )}
                />

                {/* Баббл-подсказка «НАЧАТЬ!» для активного урока */}
                {node.status === 'active' && (
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#CC7700] border-2 border-[#FF9600] font-black text-xs px-3.5 py-1 rounded-xl shadow-md uppercase tracking-wider whitespace-nowrap z-20 flex items-center justify-center gap-1.5 pointer-events-none"
                  >
                    <span>Начать</span>
                    <Sparkles size={12} className="text-[#FF9600] fill-[#FF9600]" />
                    {/* Треугольная стрелка баббла */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#FF9600]" />
                  </motion.div>
                )}

                {/* Круглая кнопка-узел урока в объемном 3D-стиле Duolingo */}
                <motion.button
                  whileHover={{ scale: node.status !== 'locked' ? 1.06 : 1 }}
                  whileTap={{ scale: node.status !== 'locked' ? 0.94 : 1 }}
                  onClick={() => handleLessonClick(node)}
                  title={node.title}
                  className={cn(
                    "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-150 z-10 cursor-pointer select-none",
                    // Пройденный: Зеленый с галочкой
                    node.status === 'completed' && "bg-[#58CC02] text-white border-b-[6px] border-[#388302] active:border-b-0 active:translate-y-1.5 shadow-md hover:bg-[#46A302]",
                    // Текущий: Оранжевый с иконкой Play
                    node.status === 'active' && "bg-[#FF9600] text-white border-b-[6px] border-[#CC7700] active:border-b-0 active:translate-y-1.5 shadow-lg ring-4 ring-orange-300/40 hover:bg-[#FF8800]",
                    // Заблокированный: Серый с замком
                    node.status === 'locked' && "bg-slate-200 text-slate-400 border-b-[6px] border-slate-300 shadow-sm cursor-not-allowed"
                  )}
                >
                  {node.status === 'completed' && (
                    <Check size={36} strokeWidth={3.5} className="drop-shadow-sm" />
                  )}
                  {node.status === 'active' && (
                    <Play size={34} strokeWidth={2.5} className="fill-white drop-shadow-sm translate-x-0.5" />
                  )}
                  {node.status === 'locked' && (
                    <Lock size={26} strokeWidth={2.5} />
                  )}

                  {/* Звезды для пройденного урока */}
                  {node.status === 'completed' && (
                    <div className="absolute -bottom-2 flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                    </div>
                  )}
                </motion.button>

                {/* Название урока под кнопкой */}
                <div className="mt-4 text-center max-w-[180px]">
                  <div className={cn(
                    "text-sm font-bold text-slate-700 tracking-tight leading-snug",
                    node.status === 'active' && "text-slate-900 font-extrabold"
                  )}>
                    {node.title}
                  </div>
                </div>

              </div>
            );
          })}

          {/* Финальная награда главы: Сундук / Кубок */}
          <div className="relative flex flex-col items-center pt-4 pb-12">
            
            {/* Парящий бейдж над сундуком */}
            <div className="mb-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-black text-amber-700 shadow-xs whitespace-nowrap">
              <Award size={14} className="text-amber-500" />
              <span>Награда главы</span>
            </div>

            {/* Объемный круг сундука/кубка w-28 h-28 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-150 z-10 select-none shadow-md",
                isModuleFinished 
                  ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white border-b-[6px] border-amber-600 shadow-amber-200 ring-4 ring-amber-300/40 cursor-pointer"
                  : "bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400"
              )}
            >
              {isModuleFinished ? (
                <Trophy size={48} strokeWidth={2.2} className="text-white drop-shadow-md fill-amber-100" />
              ) : (
                <Gift size={44} strokeWidth={2} className="text-slate-400" />
              )}

              {isModuleFinished && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#58CC02] border-2 border-white flex items-center justify-center text-white shadow-sm">
                  <Sparkles size={16} />
                </div>
              )}
            </motion.div>

            <div className="mt-3 text-center">
              <span className="text-sm font-black text-slate-700">
                {isModuleFinished ? 'Сундук открыт! +100 XP' : 'Завершите все уроки'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Модальное окно/диалог информации по закрытому или разрабатываемому уроку */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <GlassCard className="max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-200 bg-white">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 text-[#FF9600] flex items-center justify-center">
              <SparkMascot emotion="thinking" className="scale-75" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {selectedLesson.title}
            </h3>

            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              {selectedLesson.message}
            </p>

            <button
              onClick={() => setSelectedLesson(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF9600] text-white font-black text-sm border-b-4 border-[#CC7700] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm flex items-center justify-center whitespace-nowrap"
            >
              Понятно!
            </button>
          </GlassCard>
        </div>
      )}

    </div>
  );
}
