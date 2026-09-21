// src/components/ui/GlobalAudioControls.tsx
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Gauge } from 'lucide-react';
import { sound } from '../../utils/soundManager';
import { speech, SpeechSpeed } from '../../utils/speechManager';

interface GlobalAudioControlsProps {
  className?: string;
  compact?: boolean;
}

export const GlobalAudioControls: React.FC<GlobalAudioControlsProps> = ({
  className = '',
  compact = false
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.isSoundMuted());
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(speech.isAutoSpeak());
  const [speed, setSpeed] = useState<SpeechSpeed>(speech.getSpeed());

  useEffect(() => {
    const handleSoundToggle = (e: Event) => {
      const custom = e as CustomEvent<{ muted: boolean }>;
      if (typeof custom.detail?.muted === 'boolean') {
        setIsMuted(custom.detail.muted);
      }
    };

    const handleTtsToggle = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (typeof custom.detail?.enabled === 'boolean') {
        setIsTtsEnabled(custom.detail.enabled);
      }
    };

    const handleSpeedChange = (e: Event) => {
      const custom = e as CustomEvent<{ speed: SpeechSpeed }>;
      if (custom.detail?.speed) {
        setSpeed(custom.detail.speed);
      }
    };

    window.addEventListener('spark-sound-toggle', handleSoundToggle);
    window.addEventListener('spark-tts-toggle', handleTtsToggle);
    window.addEventListener('spark-tts-speed', handleSpeedChange);

    return () => {
      window.removeEventListener('spark-sound-toggle', handleSoundToggle);
      window.removeEventListener('spark-tts-toggle', handleTtsToggle);
      window.removeEventListener('spark-tts-speed', handleSpeedChange);
    };
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const toggleTts = () => {
    const next = !isTtsEnabled;
    setIsTtsEnabled(next);
    speech.setAutoSpeak(next);
    if (next) {
      sound.playClick();
      speech.speak('Озвучка включена!');
    } else {
      speech.stop();
    }
  };

  const cycleSpeed = () => {
    sound.playClick();
    const next: SpeechSpeed = speed === 'slow' ? 'normal' : speed === 'normal' ? 'fast' : 'slow';
    setSpeed(next);
    speech.setSpeed(next);
  };

  const speedLabels: Record<SpeechSpeed, string> = {
    slow: '0.8x',
    normal: '1.0x',
    fast: '1.3x'
  };

  return (
    <div className={`flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-2xl border-2 border-white/90 border-b-4 border-b-slate-300 shadow-sm ${className}`}>
      {/* 1. Звуковые эффекты */}
      <button
        type="button"
        onClick={toggleSound}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          isMuted
            ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        }`}
        title={isMuted ? 'Включить звуки игры' : 'Выключить звуки'}
        aria-label="Звуковые эффекты"
      >
        {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>

      {/* 2. Озвучка текста (диктор) */}
      <button
        type="button"
        onClick={toggleTts}
        className={`p-2 rounded-xl transition-all cursor-pointer ${
          !isTtsEnabled
            ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
        }`}
        title={isTtsEnabled ? 'Выключить озвучку' : 'Включить озвучку'}
        aria-label="Озвучка диктора"
      >
        {!isTtsEnabled ? <MicOff size={17} /> : <Mic size={17} />}
      </button>

      {/* 3. Скорость речи */}
      {!compact && isTtsEnabled && (
        <button
          type="button"
          onClick={cycleSpeed}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-black tracking-tight transition-all cursor-pointer flex items-center gap-1"
          title="Изменить скорость речи"
        >
          <Gauge size={13} className="text-slate-500" />
          <span>{speedLabels[speed]}</span>
        </button>
      )}
    </div>
  );
};
