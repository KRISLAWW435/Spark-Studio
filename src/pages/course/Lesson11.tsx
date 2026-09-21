import { Volume2, AlertTriangle, RotateCcw, Play, CheckCircle2, Square, Pause, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { SparkMascot } from '../../components/SparkMascot';
import { usePersistentState } from '../../hooks/usePersistentState';
import { cn } from '../../lib/utils';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeonButton } from '../../components/ui/NeonButton';
import { sound } from '../../utils/soundManager';
import { useSpeech } from '../../hooks/useSpeech';

const lessonData = {
  title: "Урок 1.1: Закон Фиттса (Кнопка-Мишень)",
  theory: "Кнопка в приложении — это как дверная ручка. Если сделать её микроскопической, пользователь промахнется и рассердится. Минимальная высота кнопки для пальца — 48 пикселей!\n\nКроме того, текст не должен упираться в края. Используй внутренние отступы (padding), чтобы кнопка выглядела пропорционально.",
};

export function Lesson11() {
  const navigate = useNavigate();
  const [progress, setProgress] = usePersistentState('user_progress_v1', {
    lessons: {} as Record<string, boolean>
  });

  const [height, setHeight] = useState(28);
  const [paddingX, setPaddingX] = useState(16);
  const [paddingY, setPaddingY] = useState(8);
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [audioState, setAudioState] = useState<'idle'|'playing'|'paused'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { speak } = useSpeech();

  // Exact target: Height 48, px 24, py 12
  const isRulePassed = height === 48 && paddingX === 24 && paddingY === 12;

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

  const handleCheck = () => {
    if (isRulePassed) {
      sound.playSuccess();
      speak("Потрясающе! Ты справился! Держи 50 XP.");
      setIsSuccess(true);
      setFailedAttempts(0);
      setProgress({
        ...progress,
        lessons: { ...progress.lessons, 'lesson_1_1': true }
      });
    } else {
      sound.playError();
      setFailedAttempts(p => p + 1);
      setIsSuccess(false);
    }
  };

  const handleReset = () => {
    setHeight(28);
    setPaddingX(16);
    setPaddingY(8);
    setIsSuccess(false);
    setFailedAttempts(0);
  };

  const handleNext = () => {
    navigate('/labs/button');
  };

  const needsHint = failedAttempts >= 2 && !isSuccess;

  let emotion: 'neutral' | 'thinking' | 'ecstatic' = 'neutral';
  let message = "Настрой ползунки так, чтобы кнопка точно совпала с пунктирным контуром. Цель: Высота 48px, Отступы 24px (X) и 12px (Y).";
  
  if (isSuccess) {
    emotion = 'ecstatic';
    message = "Идеально! Кнопка теперь легко нажимается пальцем, а текст свободно дышит внутри. Закон Фиттса соблюден!";
  } else if (failedAttempts > 0) {
    emotion = 'thinking';
    message = "Ой, кажется, есть несовпадение. Посмотри внимательно на пунктирную мишень на экране мобильного. Нам нужны значения: 48, 24 и 12.";
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header with High-Contrast Bold Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-soft/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/15 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-cyan-400">
            <Sparkles size={13} className="text-blue-500 animate-pulse" />
            <span>Модуль 1 • Основы кликабельности</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {lessonData.title}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
            Интерактивный тренажер по размеру сенсорных целей и расчету внутренних отступов кнопок.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-2">
        {/* Left Column - Theory, Context & Controls wrapped in GlassCard */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          
          {/* Theory + Audio in GlassCard */}
          <GlassCard className="p-6 space-y-4 relative" glow>
            <div className="flex items-center justify-between gap-2 border-b border-white/20 dark:border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Теоретическая база
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                WCAG 2.5.5 Touch Target
              </span>
            </div>

            <p className="text-slate-900 dark:text-slate-100 text-[15px] leading-relaxed whitespace-pre-wrap font-normal">
              {lessonData.theory}
            </p>
            
            <div className="flex items-center gap-2 pt-2 border-t border-white/20 dark:border-white/10">
              <button 
                onClick={toggleAudio}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm",
                  audioState === 'playing' 
                    ? 'bg-blue-600 text-white shadow-blue-500/25' 
                    : 'bg-white/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-white border border-white/40 dark:border-white/15'
                )}
              >
                {audioState === 'playing' ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                {audioState === 'playing' ? 'Пауза' : audioState === 'paused' ? 'Продолжить' : 'Озвучить'}
              </button>
              {(audioState === 'playing' || audioState === 'paused') && (
                <button 
                  onClick={stopAudio}
                  aria-label="Остановить озвучку"
                  className="p-2 rounded-full text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              )}
            </div>
          </GlassCard>

          {/* Business Context Alert */}
          <div className="bg-red-500/10 dark:bg-red-500/15 p-4 rounded-2xl border border-red-500/25 flex items-start gap-3 backdrop-blur-md">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-relaxed">
              <strong className="text-red-600 dark:text-red-400 font-bold">Боль бизнеса:</strong> 40% пользователей покидают корзину магазина, если не могут с первого раза нажать на кнопку оплаты с мобильного!
            </p>
          </div>

          {/* Interactive Inspector Controls in GlassCard */}
          <GlassCard className="p-6 space-y-6 flex-1 relative overflow-hidden" glow>
            <div className="flex items-center justify-between border-b border-white/20 dark:border-white/10 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Инспектор параметров
              </h3>
              <span className="text-xs font-mono text-pink-600 dark:text-pink-400 font-bold">
                Live State
              </span>
            </div>

            <SparkMascot emotion={emotion} message={message} />
            
            <div className={cn(
              "space-y-4 p-4 rounded-xl transition-all duration-300",
              "bg-white/40 dark:bg-black/25 border border-white/30 dark:border-white/10",
              needsHint && "ring-2 ring-blue-500/50 bg-blue-500/10 animate-pulse"
            )}>
              <div className="flex items-center justify-between gap-4 w-full">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 shrink-0 w-32">
                  Высота (Height)
                </span>
                <input 
                  type="range" min="28" max="64" step="2"
                  value={height}
                  onChange={e => {setHeight(Number(e.target.value)); setIsSuccess(false);}}
                  className="w-full flex-1 cursor-pointer accent-blue-600 dark:accent-cyan-400" 
                />
                <span className="text-xs font-mono w-14 text-right font-bold text-slate-700 dark:text-slate-300">
                  {height}px
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-4 w-full">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 shrink-0 w-32">
                  Боковые (X)
                </span>
                <input 
                  type="range" min="16" max="32" step="2"
                  value={paddingX}
                  onChange={e => {setPaddingX(Number(e.target.value)); setIsSuccess(false);}}
                  className="w-full flex-1 cursor-pointer accent-blue-600 dark:accent-cyan-400" 
                />
                <span className="text-xs font-mono w-14 text-right font-bold text-slate-700 dark:text-slate-300">
                  {paddingX}px
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 w-full">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 shrink-0 w-32">
                  Верт. (Y)
                </span>
                <input 
                  type="range" min="8" max="16" step="2"
                  value={paddingY}
                  onChange={e => {setPaddingY(Number(e.target.value)); setIsSuccess(false);}}
                  className="w-full flex-1 cursor-pointer accent-blue-600 dark:accent-cyan-400" 
                />
                <span className="text-xs font-mono w-14 text-right font-bold text-slate-700 dark:text-slate-300">
                  {paddingY}px
                </span>
              </div>
            </div>

            {/* NeonButton Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20 dark:border-white/10">
              {!isSuccess ? (
                <NeonButton 
                  variant="solid" 
                  size="md"
                  onClick={handleCheck}
                  className="flex-1"
                  params="Action: Check Solution | Target: H48/P24"
                >
                  <Play size={17} fill="currentColor" />
                  <span>Проверить решение</span>
                </NeonButton>
              ) : (
                <NeonButton 
                  variant="solid" 
                  size="md"
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                  params="Action: Next Lesson | Status: Passed"
                >
                  <CheckCircle2 size={18} />
                  <span>Завершить урок</span>
                </NeonButton>
              )}

              <NeonButton 
                variant="outline" 
                size="md"
                onClick={handleReset}
                className="px-4"
                params="Action: Reset Sliders"
              >
                <RotateCcw size={16} />
                <span>Сбросить</span>
              </NeonButton>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Canvas with iPhone wrapped in darker GlassCard */}
        <GlassCard 
          className="lg:col-span-3 bg-slate-900/10 dark:bg-slate-950/70 p-6 md:p-8 flex flex-col items-center justify-center min-h-[620px] relative overflow-hidden backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl"
          params="Canvas: iPhone Simulator | 320x600"
        >
          {/* Device Stage Backdrop Radial Lighting */}
          <div className="absolute inset-0 bg-radial from-blue-500/10 dark:from-cyan-500/15 via-transparent to-transparent pointer-events-none" />

          {/* iPhone Frame */}
          <div className="w-[320px] h-[600px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col z-10">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-30">
              <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-b-3xl"></div>
            </div>
            
            {/* App Content */}
            <div className="flex-1 pt-12 p-6 flex flex-col bg-slate-50 dark:bg-slate-950 relative z-20 transition-colors">
              <div className="w-full h-44 bg-slate-200 dark:bg-slate-800/80 rounded-2xl mb-6 shadow-inner animate-pulse"></div>
              <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700/80 rounded-lg mb-3"></div>
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md mb-auto"></div>
              
              {/* Target & Interactive Button Area */}
              <div className="relative mt-8 flex justify-center items-center py-8">
                
                {/* Ghost Target Box (Ideal 48px Height, 24px X, 12px Y) */}
                <div 
                  className="absolute z-10 border-2 border-dashed border-blue-500 dark:border-cyan-400 bg-blue-500/10 dark:bg-cyan-500/15 rounded-xl flex items-center justify-center pointer-events-none transition-all duration-300 shadow-[0_0_20px_rgba(66,133,244,0.25)]"
                  style={{
                    height: '48px',
                    padding: '12px 24px',
                    boxSizing: 'border-box'
                  }}
                >
                  <span className="opacity-0 font-semibold text-[15px] leading-tight">Оформить заказ</span>
                  
                  {/* Floating target tooltip indicator */}
                  <div className="absolute -top-9 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full shadow-md border border-border-soft flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 whitespace-nowrap">
                      Цель: H:48 | P:24/12
                    </span>
                    <div className="w-2 h-2 bg-white dark:bg-slate-800 border-r border-b border-border-soft rotate-45 translate-y-1"></div>
                  </div>
                </div>

                {/* User Controlled Button */}
                <button 
                  className={cn(
                    "font-bold rounded-xl shadow-lg transition-all duration-200 whitespace-nowrap relative z-20 flex items-center justify-center text-[15px] leading-tight select-none",
                    isSuccess 
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-105" 
                      : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:scale-[1.02] active:scale-95"
                  )}
                  style={{
                    minHeight: `${height}px`,
                    padding: `${paddingY}px ${paddingX}px`,
                    boxSizing: 'border-box'
                  }}
                >
                  Оформить заказ
                </button>
              </div>
            </div>
            
            {/* Home indicator bar */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center z-30">
              <div className="w-24 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
