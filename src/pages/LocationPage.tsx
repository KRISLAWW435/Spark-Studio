// src/pages/LocationPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Volume2, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Lock,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  WORLD_LOCATIONS, 
  WorldLocation, 
  WorldTask, 
  INITIAL_PLAYER_STATE, 
  PlayerWorldState 
} from '../data/worldMap';
import { usePersistentState } from '../hooks/usePersistentState';
import { SparkMascotV3 } from '../components/SparkMascotV3';
import { GlassCard } from '../components/ui/GlassCard';
import { sound } from '../utils/soundManager';
import { useSpeech } from '../hooks/useSpeech';

interface DialogueLine {
  speaker: 'character' | 'spark' | 'narrator';
  text: string;
  emotion?: 'happy' | 'sad' | 'excited' | 'thinking' | 'serious';
}

// 1. Сюжетные диалоги для персонажей
const MARI_INITIAL_DIALOGUE: DialogueLine[] = [
  { speaker: 'narrator', text: 'Ты заходишь в уютную кофейню. В воздухе витает аромат свежей корицы и жареной арабики.' },
  { speaker: 'character', text: 'Привет! Рада видеть тебя! Поможешь мне с одним делом?', emotion: 'happy' },
  { speaker: 'spark', text: 'О! У Мари проблема с приложением. Давай поможем!', emotion: 'excited' },
  { speaker: 'character', text: 'Клиенты путаются в мобильном заказе. Главная кнопка слишком маленькая и теряется на экране!', emotion: 'sad' },
  { speaker: 'spark', text: 'Понял! Тогда открывай конструктор — будем делать большую заметную кнопку!', emotion: 'thinking' },
];

const MARI_TASK1_DONE_DIALOGUE: DialogueLine[] = [
  { speaker: 'character', text: 'Спасибо! Ты справился! Вот твоя награда в монетах и значок в рюкзак.', emotion: 'happy' },
  { speaker: 'spark', text: 'Кнопка теперь видна с первого взгляда! А что у нас со второй проблемой?', emotion: 'excited' },
  { speaker: 'character', text: 'Взгляни на наши ценники: серый мелкий текст на бежевом фоне. Гости напрягают глаза!', emotion: 'thinking' },
  { speaker: 'spark', text: 'Настроим правильный цветовой контраст и размер шрифта для ценников!', emotion: 'happy' }
];

const KIRILL_INITIAL_DIALOGUE: DialogueLine[] = [
  { speaker: 'narrator', text: 'Ты заходишь в техно-хаб. Вокруг мерцают мониторы с кодом и мобильными прототипами.' },
  { speaker: 'character', text: 'Приветствую! Красота без расчета эргономики — пустая трата ресурсов.', emotion: 'serious' },
  { speaker: 'spark', text: 'Кирилл — мастер мобильных сеток и закона Фиттса! Что у нас по задаче?', emotion: 'excited' },
  { speaker: 'character', text: 'Пользователи на ходу промахиваются мимо кнопок. Область касания меньше 48px — критический баг!', emotion: 'thinking' },
  { speaker: 'spark', text: 'Точно! Увеличим зону тапа и проверим сетку по стандарту Android и iOS.', emotion: 'thinking' },
];

const KIRILL_TASK1_DONE_DIALOGUE: DialogueLine[] = [
  { speaker: 'character', text: 'Превосходно! Процент случайных нажатий упал до нуля. Забирай свои монеты!', emotion: 'happy' },
  { speaker: 'spark', text: 'Отличный результат! Переходим ко второй задаче?', emotion: 'excited' },
  { speaker: 'character', text: 'Да, нужно реализовать наглядные состояния: Hover, Active и Disabled для полного контроля.', emotion: 'thinking' },
  { speaker: 'spark', text: 'Приступим к состояниям интерактивных кнопок!', emotion: 'happy' }
];

const SONYA_INITIAL_DIALOGUE: DialogueLine[] = [
  { speaker: 'narrator', text: 'В залитой светом мастерской пахнет свежей краской, а стены увешаны плакатами гарнитур.' },
  { speaker: 'character', text: 'Салют! Дизайн говорит с человеком через чистый ритм, цвет и типографику.', emotion: 'happy' },
  { speaker: 'spark', text: 'Соня знает всё про анти-слап баланс и выразительные шрифтовые пары!', emotion: 'excited' },
  { speaker: 'character', text: 'Наш афишный постер выглядит перегруженным. Шрифты спорят друг с другом!', emotion: 'sad' },
  { speaker: 'spark', text: 'Погнали в лабораторию типографики — выстроим безупречную иерархию!', emotion: 'thinking' },
];

const SONYA_TASK1_DONE_DIALOGUE: DialogueLine[] = [
  { speaker: 'character', text: 'Потрясающе! Шрифт заиграл новыми красками, иерархия заголовков идеальна!', emotion: 'happy' },
  { speaker: 'spark', text: 'Ура! Ты получил монеты и редкую палитру в рюкзак!', emotion: 'excited' },
  { speaker: 'character', text: 'Остался второй шаг — проверить контраст по стандарту WCAG AA (минимум 4.5:1).', emotion: 'thinking' },
  { speaker: 'spark', text: 'Лаборатория цвета уже готова к калибровке контраста!', emotion: 'happy' }
];

export function LocationPage() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { speak } = useSpeech();

  const [playerState, setPlayerState] = usePersistentState<PlayerWorldState>('player_world_state_v1', INITIAL_PLAYER_STATE);

  // Находим текущую локацию
  const location: WorldLocation = WORLD_LOCATIONS.find(l => l.id === locationId) || WORLD_LOCATIONS[0];
  const character = location.character;

  // Проверяем, выполнено ли задание 1
  const task1 = location.tasks[0];
  const task2 = location.tasks[1];
  const isTask1Completed = task1 ? playerState.completedTasks.includes(task1.id) : false;
  const isTask2Completed = task2 ? playerState.completedTasks.includes(task2.id) : false;

  // Определяем активный список реплик новеллы в зависимости от персонажа и прогресса
  const getDialogueList = (): DialogueLine[] => {
    if (location.id === 'cafe_marie' || location.id === 'mari-cafe') {
      return isTask1Completed ? MARI_TASK1_DONE_DIALOGUE : MARI_INITIAL_DIALOGUE;
    }
    if (location.id === 'tech_kirill' || location.id === 'kirill-hub') {
      return isTask1Completed ? KIRILL_TASK1_DONE_DIALOGUE : KIRILL_INITIAL_DIALOGUE;
    }
    if (location.id === 'art_sonya' || location.id === 'sonya-studio') {
      return isTask1Completed ? SONYA_TASK1_DONE_DIALOGUE : SONYA_INITIAL_DIALOGUE;
    }
    return [
      { speaker: 'narrator', text: `Ты находишься в локации «${location.title}».` },
      { speaker: 'character', text: character?.greeting || 'Добро пожаловать!', emotion: 'happy' },
      { speaker: 'spark', text: location.sparkQuote, emotion: 'thinking' }
    ];
  };

  const dialogue = getDialogueList();

  // Состояние шага диалога новеллы
  const [currentStep, setCurrentStep] = useState(0);
  const [isDialogueCompleted, setIsDialogueCompleted] = useState(false);

  // Эффект печатной машинки
  const currentLine = dialogue[Math.min(currentStep, dialogue.length - 1)];
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;
    const targetText = currentLine.text;

    const timer = setInterval(() => {
      charIndex++;
      setDisplayedText(targetText.slice(0, charIndex));
      if (charIndex >= targetText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentStep, currentLine.text]);

  // Обработчик кнопки «Далее →»
  const handleNextClick = () => {
    sound.playClick();

    // Если текст еще печатается — сразу завершить печать текущей строки
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    // Если это последняя реплика — завершить диалог и открыть задания
    if (currentStep >= dialogue.length - 1) {
      setIsDialogueCompleted(true);
      sound.playSuccess();
      return;
    }

    // Переход к следующей реплике
    setCurrentStep(prev => prev + 1);
  };

  // Перезапуск диалога
  const handleRestartDialogue = () => {
    sound.playClick();
    setCurrentStep(0);
    setIsDialogueCompleted(false);
  };

  // Выполнение задания демо
  const handleTaskComplete = (task: WorldTask) => {
    sound.playSuccess();
    speak(`Отличная работа! Задание «${task.title}» выполнено! Ты получаешь ${task.rewardCoins} монет!`);

    if (!playerState.completedTasks.includes(task.id)) {
      const newBackpack = task.rewardItem 
        ? [...playerState.backpack, { ...task.rewardItem, source: location.title }]
        : playerState.backpack;

      setPlayerState({
        ...playerState,
        coins: playerState.coins + task.rewardCoins,
        completedTasks: [...playerState.completedTasks, task.id],
        backpack: newBackpack
      });

      // Перезапуск диалога с новыми победными репликами
      setCurrentStep(0);
      setIsDialogueCompleted(false);
    }
  };

  // Вычисляем данные говорящего
  const getSpeakerDetails = () => {
    if (currentLine.speaker === 'character') {
      return {
        name: character?.name || 'Персонаж',
        role: character?.role || 'Житель квартала',
        avatar: character?.avatar || '👤',
        color: location.theme.primary,
        bgColor: `${location.theme.primary}20`
      };
    }
    if (currentLine.speaker === 'spark') {
      return {
        name: 'Спарк',
        role: 'Маскот-наставник',
        avatar: '🔥',
        color: '#FF9600',
        bgColor: '#FFEDD5'
      };
    }
    return {
      name: 'Рассказчик',
      role: 'Окружение',
      avatar: '📜',
      color: '#64748B',
      bgColor: '#F1F5F9'
    };
  };

  const speaker = getSpeakerDetails();
  const isLastStep = currentStep === dialogue.length - 1;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Верхняя навигация и статус */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            sound.playClick();
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-extrabold text-sm hover:border-[#FF9600] hover:text-[#FF9600] transition-colors shadow-sm cursor-pointer active:scale-95"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Назад к Карте мира</span>
        </button>

        {/* Счетчики игрока */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-sm shadow-sm">
            <span>🪙</span>
            <span>{playerState.coins} монет</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 font-black text-sm shadow-sm">
            <span>🎒</span>
            <span>{playerState.backpack.length} в рюкзаке</span>
          </div>
        </div>
      </div>

      {/* Основная зона новеллы и заданий */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА: Сюжетная Визуальная Новелла (7 колонок) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Главная сцена с интерьером локации и эффектом присутствия */}
          <div 
            className="relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-slate-300 shadow-xl flex flex-col justify-between p-6 transition-all"
            style={{
              background: `linear-gradient(145deg, ${location.theme.secondary}, #0F172A)`
            }}
          >
            {/* Декоративные атмосферные элементы на фоне */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
              <div className="absolute top-6 left-10 text-7xl animate-pulse">
                {location.id.includes('mari') || location.id.includes('cafe') ? '☕' : location.id.includes('kirill') ? '💻' : '🎨'}
              </div>
              <div className="absolute top-24 right-12 text-6xl">
                {location.id.includes('mari') || location.id.includes('cafe') ? '🥐' : location.id.includes('kirill') ? '⚡' : '✨'}
              </div>
              <div className="absolute bottom-32 left-1/3 text-5xl">
                {location.id.includes('mari') || location.id.includes('cafe') ? '🧁' : location.id.includes('kirill') ? '📱' : '🖌️'}
              </div>
            </div>

            {/* Затемнение фона, когда говорит персонаж */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity" />

            {/* Верхний статус сцены */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 text-white text-xs font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{location.title}</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-300">{location.zone}</span>
              </div>

              {/* Кнопка повтора диалога */}
              <button
                onClick={handleRestartDialogue}
                title="Перечитать диалог сначала"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Заново</span>
              </button>
            </div>

            {/* Центральные персонажи на сцене */}
            <div className="relative z-10 flex items-end justify-between px-4 pb-2">
              
              {/* Спарк на сцене */}
              <motion.div 
                animate={{ 
                  scale: currentLine.speaker === 'spark' ? 1.08 : 0.95,
                  opacity: currentLine.speaker === 'spark' ? 1 : 0.75
                }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className={`transition-all rounded-full p-1 ${currentLine.speaker === 'spark' ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-amber-500/50' : ''}`}>
                  <SparkMascotV3 
                    size={110} 
                    emotion={
                      currentLine.speaker === 'spark' 
                        ? (currentLine.emotion === 'thinking' ? 'thinking' : currentLine.emotion === 'happy' ? 'happy' : 'excited') 
                        : 'idle'
                    }
                  />
                </div>
                <span className="mt-1 text-xs font-black text-amber-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Спарк
                </span>
              </motion.div>

              {/* Персонаж локации на сцене */}
              {character && (
                <motion.div 
                  animate={{ 
                    scale: currentLine.speaker === 'character' ? 1.1 : 0.95,
                    opacity: currentLine.speaker === 'character' ? 1 : 0.75
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-5xl bg-white/90 backdrop-blur-md border-3 transition-all ${
                    currentLine.speaker === 'character' 
                      ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 shadow-xl scale-105' 
                      : 'border-white/40'
                  }`}
                  style={{ borderColor: location.theme.primary }}
                  >
                    {character.avatar}
                  </div>
                  <span className="mt-2 text-xs font-black text-white bg-slate-900/80 px-3 py-0.5 rounded-full border border-white/20">
                    {character.name}
                  </span>
                </motion.div>
              )}

            </div>
          </div>

          {/* 2. ИНТЕРФЕЙС НОВЕЛЛЫ: Большая панель реплики внизу */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-lg p-5 relative overflow-hidden">
            
            {/* Индикатор прогресса новеллы */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#FF9600]" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Сюжетная линия • Реплика {currentStep + 1} из {dialogue.length}
                </span>
              </div>

              {/* Точки шагов */}
              <div className="flex items-center gap-1.5">
                {dialogue.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === currentStep 
                        ? 'w-6 bg-[#FF9600]' 
                        : i < currentStep 
                        ? 'w-2 bg-emerald-500' 
                        : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Карточка текущей реплики */}
            <div className="flex items-start gap-4">
              
              {/* Аватар говорящего (подсвечивается и пульсирует) */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md border-2 transition-all animate-pulse"
                style={{ 
                  backgroundColor: speaker.bgColor, 
                  borderColor: speaker.color,
                  boxShadow: `0 0 16px ${speaker.color}40`
                }}
              >
                {speaker.avatar}
              </div>

              {/* Текст и имя */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="font-black text-sm tracking-tight"
                    style={{ color: speaker.color }}
                  >
                    {speaker.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {speaker.role}
                  </span>
                </div>

                {/* Текст с эффектом печатной машинки */}
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed min-h-[56px] select-text">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-2 h-4 ml-1 bg-[#FF9600] animate-pulse" />
                  )}
                </p>
              </div>

            </div>

            {/* Справа внизу — КНОПКА «ДАЛЕЕ →» (единственная кнопка!) */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              
              {/* Кнопка озвучки реплики */}
              <button
                onClick={() => {
                  sound.playClick();
                  speak(currentLine.text);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Volume2 size={15} />
                <span>Озвучить</span>
              </button>

              {/* Главная кнопка продвижения истории */}
              <button
                onClick={handleNextClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#FF7700] hover:from-[#FF8800] hover:to-[#FF6600] text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>{isLastStep ? 'Начать задание 🚀' : 'Далее →'}</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

            </div>

          </div>

        </div>

        {/* ПРАВАЯ КОЛОНКА: Задания (появляются после диалога) (5 колонок) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>🎯 Задания персонажа</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {location.tasks.length} квеста
              </span>
            </h2>

            {/* Бейдж доступности */}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isDialogueCompleted || isTask1Completed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isDialogueCompleted || isTask1Completed ? 'Доступны к выполнению' : 'Слушай диалог 🔒'}
            </span>
          </div>

          {/* Контейнер заданий: если диалог еще не пройден — показываем заглушку с замком */}
          {!isDialogueCompleted && !isTask1Completed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/80 text-center flex flex-col items-center justify-center space-y-3 min-h-[360px]"
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-200/80 flex items-center justify-center text-3xl text-slate-400 shadow-inner">
                <Lock size={32} />
              </div>
              <h3 className="font-black text-slate-800 text-lg">
                Задания заблокированы
              </h3>
              <p className="text-xs font-semibold text-slate-500 max-w-xs leading-relaxed">
                Нажимай кнопку «Далее →» в диалоге слева, чтобы погрузиться в историю и получить первое задание от {character?.name}!
              </p>
              <button
                onClick={handleNextClick}
                className="mt-2 px-5 py-2.5 rounded-xl bg-white border-2 border-[#FF9600] text-[#FF9600] font-black text-xs hover:bg-[#FF9600] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Продвинуть диалог →
              </button>
            </motion.div>
          ) : (
            /* Плавное появление заданий после диалога */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {location.tasks.map((task, idx) => {
                const isCompleted = playerState.completedTasks.includes(task.id);
                // Задание 2 доступно только после завершения задания 1
                const isLocked = idx > 0 && !isTask1Completed;

                return (
                  <GlassCard
                    key={task.id}
                    className={`p-5 rounded-3xl border-2 transition-all shadow-sm ${
                      isCompleted 
                        ? 'border-emerald-300 bg-emerald-50/50' 
                        : isLocked
                        ? 'border-slate-200 bg-slate-100/70 opacity-75'
                        : 'border-slate-200 bg-white hover:border-[#1CB0F6]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                          isCompleted ? 'bg-emerald-500 text-white' : isLocked ? 'bg-slate-300 text-slate-600' : 'bg-slate-900 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-black text-slate-900 text-base leading-snug">
                            {task.title}
                          </h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {idx === 0 ? 'Основной квест' : 'Продвинутый квест'}
                          </span>
                        </div>
                      </div>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 size={13} strokeWidth={3} />
                          Выполнено
                        </span>
                      ) : isLocked ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                          <Lock size={12} />
                          Сначала квест 1
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-600 font-semibold mt-2.5 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Награда */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-amber-600 flex items-center gap-1">
                          🪙 +{task.rewardCoins} монет
                        </span>
                        {task.rewardItem && (
                          <span className="text-purple-600 flex items-center gap-1">
                            {task.rewardItem.icon} {task.rewardItem.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Действия квеста */}
                    {!isLocked && (
                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          to={task.actionPath}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                        >
                          <span>{task.actionLabel}</span>
                          <ChevronRight size={14} />
                        </Link>

                        {!isCompleted && (
                          <button
                            onClick={() => handleTaskComplete(task)}
                            title="Сдать задание и получить награду"
                            className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-transform active:scale-95 shadow-sm shadow-emerald-500/20 cursor-pointer"
                          >
                            Сдать 🎁
                          </button>
                        )}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </motion.div>
          )}

          {/* Подсказка от Спарка в правом нижнем блоке */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-4 flex items-center gap-4 shadow-sm">
            <div className="shrink-0">
              <SparkMascotV3 
                size={75} 
                emotion="happy" 
              />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-black text-[#FF9600] uppercase tracking-wider">
                Совет Спарка
              </div>
              <p className="text-xs font-bold text-slate-700 leading-snug mt-0.5">
                {location.sparkQuote}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
