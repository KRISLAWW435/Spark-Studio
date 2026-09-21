import { Volume2, CheckCircle2, Play, Square, Pause } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { SparkMascot } from '../../components/SparkMascot';
import { usePersistentState } from '../../hooks/usePersistentState';
import { Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { sound } from '../../utils/soundManager';
import { useSpeech } from '../../hooks/useSpeech';

const lessonData = {
  title: "Модуль 0: Что такое UI и UX?",
  theory: "UI (User Interface) — это то, как выглядит продукт. Цвета, шрифты, отступы, красота.\n\nUX (User Experience) — это то, как продукт работает. Насколько легко и быстро пользователь может достичь своей цели.\n\nЕсли продукт красивый, но непонятный — это плохой UX. Давай посмотрим на пример заказа кофе.",
};

export function Lesson01() {
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const [progress, setProgress] = usePersistentState('user_progress_v1', {
    lessons: {} as Record<string, boolean>
  });

  const [mode, setMode] = useState<'ui' | 'ux'>('ui');
  const [isSuccess, setIsSuccess] = useState(false);
  const [coffeeOrdered, setCoffeeOrdered] = useState(false);
  
  const [audioState, setAudioState] = useState<'idle'|'playing'|'paused'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (audioState === 'playing') {
      window.speechSynthesis.pause();
      setAudioState('paused');
    } else if (audioState === 'paused') {
      window.speechSynthesis.resume();
      setAudioState('playing');
    } else {
      const utterance = new SpeechSynthesisUtterance(lessonData.theory);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.onend = () => setAudioState('idle');
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setAudioState('playing');
    }
  };

  const stopAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setAudioState('idle');
  };

  const handleNext = () => {
    setProgress({
      ...progress,
      lessons: {
        ...progress.lessons,
        'lesson_0_1': true
      }
    });
    navigate('/');
  };

  const orderCoffee = () => {
    if (mode === 'ux') {
      setCoffeeOrdered(true);
      setIsSuccess(true);
      sound.playSuccess();
      speak("Потрясающе! Ты справился! Держи 50 XP.");
    } else {
      sound.playError();
      alert("Кнопка заказа слишком незаметная, или вообще непонятно, куда жать! (Плохой UX)");
    }
  };

  // Spark Mascot Logic
  let emotion: 'neutral' | 'thinking' | 'ecstatic' = 'neutral';
  let message = "Привет! Я Спарк. Давай посмотрим, как работает интерфейс без UX. Попробуй заказать кофе!";
  
  if (mode === 'ux' && !isSuccess) {
    emotion = 'neutral';
    message = "Вот теперь другое дело! Кнопка большая и понятная. Жми!";
  } else if (isSuccess) {
    emotion = 'ecstatic';
    message = "Отлично! Ты понял разницу: UX делает интерфейс удобным и решает задачу пользователя.";
  } else if (mode === 'ui') {
    emotion = 'thinking';
    message = "Красиво, но где тут кнопка заказа? Попробуй переключить режим!";
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft pb-6">
        <div>
          <span className="text-sm font-medium text-accent-blue mb-1 block">Модуль 0 • Онбординг</span>
          <h1 className="text-3xl font-semibold tracking-tight text-text-main">{lessonData.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-4">
        {/* Left Column - Theory */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          
          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-4">
            <p className="text-text-main text-[15px] leading-relaxed whitespace-pre-wrap">{lessonData.theory}</p>
            
            <div className="flex items-center gap-2 pt-2 border-t border-border-soft">
              <button 
                onClick={toggleAudio}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  audioState === 'playing' ? 'bg-accent-blue text-white' : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
                )}
              >
                {audioState === 'playing' ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                {audioState === 'playing' ? 'Пауза' : audioState === 'paused' ? 'Продолжить' : 'Озвучить'}
              </button>
              {(audioState === 'playing' || audioState === 'paused') && (
                <button 
                  onClick={stopAudio}
                  className="p-2 rounded-full text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-6 flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Интерактив</h3>
<SparkMascot emotion={emotion} message={message} />
            
            <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg">
              <button 
                onClick={() => { setMode('ui'); setCoffeeOrdered(false); setIsSuccess(false); }}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                  mode === 'ui' ? 'bg-white dark:bg-slate-700 text-text-main shadow' : 'text-text-muted hover:text-text-main'
                )}
              >
                Только UI
              </button>
              <button 
                onClick={() => setMode('ux')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                  mode === 'ux' ? 'bg-accent-blue text-white shadow' : 'text-text-muted hover:text-text-main'
                )}
              >
                UI + UX
              </button>
            </div>

            {isSuccess && (
              <button 
                onClick={handleNext}
                className="w-full bg-accent-green hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Завершить и продолжить
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Canvas */}
        <div className="lg:col-span-3 bg-black/5 dark:bg-black/20 p-6 rounded-ios-lg shadow-inner border border-border-soft flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
          
          <div className="w-[320px] h-[600px] bg-slate-50 rounded-[3rem] shadow-2xl border-[8px] border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col z-10">
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-10">
              <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-b-3xl"></div>
            </div>
            
            <div className="flex-1 relative">
              {/* Coffee Image / 3D Art Area */}
              <div className="h-2/3 w-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center relative overflow-hidden">
                {/* Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-[#FBBC05]/20 rounded-full blur-3xl"></div>
                </div>
                
                {/* 3D Coffee SVG Illustration */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative z-10 w-48 h-48 drop-shadow-2xl"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                      </linearGradient>
                      <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B4513" />
                        <stop offset="100%" stopColor="#3E1F00" />
                      </linearGradient>
                      <linearGradient id="saucerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.4"/>
                      </filter>
                    </defs>
                    
                    {/* Saucer */}
                    <ellipse cx="100" cy="160" rx="70" ry="20" fill="url(#saucerGrad)" filter="url(#shadow)" />
                    <ellipse cx="100" cy="160" rx="45" ry="12" fill="#E2E8F0" />
                    
                    {/* Handle */}
                    <path d="M 140 100 C 180 90, 180 140, 140 130" fill="none" stroke="url(#cupGrad)" strokeWidth="16" strokeLinecap="round" filter="url(#shadow)" />
                    
                    {/* Cup Body */}
                    <path d="M 40 80 Q 40 160 80 160 L 120 160 Q 160 160 160 80 Z" fill="url(#cupGrad)" filter="url(#shadow)" />
                    
                    {/* Cup Top Edge (Rim) */}
                    <ellipse cx="100" cy="80" rx="60" ry="20" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Coffee Liquid */}
                    <ellipse cx="100" cy="82" rx="52" ry="16" fill="url(#coffeeGrad)" />
                    
                    {/* Foam Art */}
                    <path d="M 70 82 Q 100 75 120 82 Q 100 90 70 82 Z" fill="#FDE68A" opacity="0.8" />
                    <path d="M 80 78 C 90 65, 110 95, 120 82" stroke="#FDE68A" strokeWidth="3" fill="none" opacity="0.6" />
                    
                    {/* Steam */}
                    <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.4" fill="none">
                      <path d="M 80 60 Q 75 40 85 20" className="animate-[pulse_3s_infinite]" />
                      <path d="M 100 65 Q 110 40 95 15" className="animate-[pulse_3s_infinite_0.5s]" />
                      <path d="M 120 60 Q 115 45 125 30" className="animate-[pulse_3s_infinite_1s]" />
                    </g>
                  </svg>
                </motion.div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-slate-50 rounded-t-3xl h-1/2 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: mode === 'ui' ? 'cursive' : 'inherit' }}>Капучино</h2>
                  <span className="text-xl font-medium text-slate-800">$4.50</span>
                </div>
                
                <p className={`text-slate-500 mb-auto ${mode === 'ui' ? 'text-xs italic' : 'text-sm'}`}>
                  Свежеобжаренная арабика с густой молочной пенкой.
                </p>

                {/* The Button */}
                <div className="mt-6 flex justify-center items-center">
                  {mode === 'ui' ? (
                    <button 
                      onClick={orderCoffee}
                      className="text-slate-400 hover:text-slate-600 text-xs font-light tracking-widest border-b border-slate-300 pb-1 transition-colors"
                    >
                      добавить в корзину
                    </button>
                  ) : (
                    <button 
                      onClick={orderCoffee}
                      className="w-full bg-[#1E293B] text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      {coffeeOrdered ? 'Заказ оформлен ✓' : 'Заказать'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-2 inset-x-0 flex justify-center z-10">
              <div className="w-24 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
