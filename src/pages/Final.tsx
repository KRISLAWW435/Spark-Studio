// src/pages/Final.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Download, ArrowRight, CheckCircle2, ArrowLeft, Share2, Image as ImageIcon } from 'lucide-react';
import { SparkEmotionSprite } from '../components/mascot/SparkEmotionSprite';
import { MariaCharacter } from '../components/mascot/MariaCharacter';
import { usePlayer } from '../context/PlayerContext';
import { sound } from '../utils/soundManager';
import { SpeechButton } from '../components/ui/SpeechButton';
import { SkyBackground } from '../components/ui/SkyBackground';
import { GlobalAudioControls } from '../components/ui/GlobalAudioControls';

export const Final: React.FC = () => {
  const navigate = useNavigate();
  const { userName, studioName, studioColor, avatarId, exportSaveKey, addCoins, player } = usePlayer();
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [hasClaimedBonus, setHasClaimedBonus] = useState<boolean>(false);

  const handleDownload = () => {
    sound.playClick();
    setHasDownloaded(true);
    exportSaveKey();
  };

  const handleSharePng = async () => {
    sound.playClick();
    setIsGeneratingPng(true);
    setShareFeedback(null);

    try {
      // 1. Создание сертификата на HTML5 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Фоновый градиент
        const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(0.5, '#1E293B');
        bgGrad.addColorStop(1, '#0F172A');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1200, 800);

        // Золотая рамка
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 10;
        ctx.strokeRect(30, 30, 1140, 740);

        // Тонкая внутренняя рамка
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 2;
        ctx.strokeRect(45, 45, 1110, 710);

        // Декоративные уголки
        const corners = [
          [50, 50],
          [1150, 50],
          [50, 750],
          [1150, 750]
        ];
        ctx.fillStyle = '#F59E0B';
        corners.forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Заголовок
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐ SPARK UX KIDS ACADEMY ⭐', 600, 110);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 48px sans-serif';
        ctx.fillText('СЕРТИФИКАТ ДИЗАЙНЕРА', 600, 180);

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('Настоящим подтверждается, что юный создатель', 600, 240);

        // Имя дизайнера
        ctx.fillStyle = '#38BDF8';
        ctx.font = '900 52px sans-serif';
        ctx.fillText(userName || 'Саша', 600, 310);

        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('успешно открыл(а) собственную дизайн-студию', 600, 370);

        // Название студии
        ctx.fillStyle = '#F59E0B';
        ctx.font = '900 44px sans-serif';
        ctx.fillText(`«${studioName || 'Спарк Студия'}»`, 600, 435);

        // Плашка с достижениями
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(200, 480, 800, 130, 20);
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✓ Первый проект: кнопка магазина Макса готова и протестирована!', 600, 525);

        ctx.fillStyle = '#F472B6';
        ctx.fillText('✓ Получен первый заказ от кондитера Марии («Сладкая искра»)', 600, 565);

        // Нижняя строка
        const dateStr = new Date().toLocaleDateString('ru-RU');
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`📅 Дата выдачи: ${dateStr}`, 100, 680);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#FBBF24';
        ctx.fillText('✨ Наставник: Спарк', 1100, 680);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#64748B';
        ctx.font = '16px sans-serif';
        ctx.fillText('Печать подлинности проекта: SPARK-UX-CERTIFIED-STUDIO', 600, 725);

        // Экспорт в PNG blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsGeneratingPng(false);
            return;
          }

          const file = new File([blob], `${studioName || 'studio'}-certificate.png`, {
            type: 'image/png'
          });

          // Проверка Web Share API с файлами
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `Сертификат студии «${studioName || 'Спарк'}»`,
                text: `Посмотри! Я открыл собственную дизайн-студию «${studioName}» в Spark UX!`,
                files: [file]
              });
              setShareFeedback('Отправлено! ✨');
              sound.playSuccess();
            } catch (err) {
              // Пользователь отменил или не удалось — делаем скачивание
              triggerDownload(blob);
            }
          } else {
            triggerDownload(blob);
          }
          setIsGeneratingPng(false);
        }, 'image/png');
      }
    } catch (e) {
      console.error('Ошибка создания сертификата:', e);
      setIsGeneratingPng(false);
    }
  };

  const triggerDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${studioName || 'spark-studio'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sound.playSuccess();
    setShareFeedback('Картинка сохранена! 📸');
    setTimeout(() => setShareFeedback(null), 4000);
  };

  const handleStartAdventure = () => {
    sound.playSuccess();
    if (!hasClaimedBonus) {
      addCoins(50);
      setHasClaimedBonus(true);
    }
    navigate('/map');
  };

  return (
    <SkyBackground className="p-4 sm:p-6">
      {/* 1. Верхний бар */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between z-10 pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            navigate('/practice');
          }}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-2 border-white/90 border-b-4 border-b-slate-300 text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Практика</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-2xl bg-white text-[#7C3AED] font-black text-xs sm:text-sm uppercase border-2 border-white/90 shadow-sm">
            🎉 Финал создания студии
          </span>
          <GlobalAudioControls compact={true} />
        </div>
      </header>

      {/* 2. Основное содержимое: Сертификат + Первый заказчик */}
      <main className="flex-1 max-w-3xl w-full mx-auto flex flex-col items-center justify-center my-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full bg-white rounded-3xl p-8 sm:p-10 border-4 border-white/90 border-b-8 border-b-sky-700/20 shadow-2xl text-center"
        >
          {/* Значок завершения */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#FF9600] to-[#F59E0B] p-1 shadow-md mb-4 flex items-center justify-center text-white text-4xl border-2 border-white">
            🏆
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#17345F] mb-2">
            Студия «{studioName || 'Спарк Студия'}» открыта!
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
            Поздравляем! Ты прошёл основы и открыл собственную дизайн-студию.
          </p>

          {/* Карточка-визитка студии */}
          <div
            className="p-5 rounded-3xl border-2 border-dashed mb-6 flex items-center justify-between text-left shadow-xs"
            style={{
              backgroundColor: `${studioColor}15`,
              borderColor: studioColor
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-white"
                style={{ backgroundColor: studioColor }}
              >
                🎨
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Дизайнер:</div>
                <div className="text-lg font-black text-[#17345F]">
                  {userName || 'Саша'}
                </div>
                <div className="text-xs font-black uppercase text-[#7C3AED]">
                  Студия: {studioName || 'Спарк Студия'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-white text-emerald-700 font-black text-xs border border-emerald-300 shadow-xs uppercase">
                ✓ Сертифицирован
              </span>
              <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Баланс: 💰 {player.coins}
              </div>
            </div>
          </div>

          {/* Диалог с первой заказчицей Марией */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl border-2 border-rose-200 text-left flex items-center gap-4 mb-6 shadow-xs">
            <div className="w-16 h-20 rounded-2xl bg-white/80 border-2 border-rose-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <MariaCharacter size={55} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm font-black text-rose-900">
                  Кондитер Мария • Твой первый заказчик!
                </div>
                <SpeechButton
                  text={`Привет, ${userName}! У меня открывается кондитерская «Сладкая искра», и нам срочно требуется красивое меню и витрина десертов. Отправляйся на Карту островов — я жду тебя!`}
                  size={15}
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed mt-1">
                «Привет, <span className="font-bold text-rose-600">{userName}</span>! У меня открывается кондитерская «Сладкая искра», и нам срочно требуется оформление меню и десертов. Отправляйся на Карту островов — я жду тебя!»
              </p>
            </div>
          </div>

          {/* Сообщение об успешном сохранении PNG */}
          {shareFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 py-2 px-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-sm font-black flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              <span>{shareFeedback}</span>
            </motion.div>
          )}

          {/* Кнопки действий: Скачать ключ, Поделиться сертификатом (PNG) и В мир дизайна */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Кнопка: Скачать ключ */}
            <button
              type="button"
              onClick={handleDownload}
              className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-2 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] ${
                hasDownloaded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 border-b-4 border-b-emerald-400'
                  : 'bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE] border-b-4 border-b-[#C4B5FD] active:translate-y-0.5 active:border-b-2 shadow-sm'
              }`}
            >
              {hasDownloaded ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Ключ сохранён</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Скачать ключ (.spark)</span>
                </>
              )}
            </button>

            {/* Кнопка: Сертификат (PNG) */}
            <button
              type="button"
              onClick={handleSharePng}
              disabled={isGeneratingPng}
              className="py-3.5 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-[#0369A1] font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-sky-300 border-b-4 border-b-sky-400 active:translate-y-0.5 active:border-b-2 shadow-sm cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Share2 size={18} />
              <span>{isGeneratingPng ? 'Создаю...' : 'Сертификат (PNG)'}</span>
            </button>

            {/* Кнопка: В мир дизайна */}
            <button
              type="button"
              onClick={handleStartAdventure}
              className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF9600] to-[#E96820] text-white font-black text-sm uppercase tracking-wider border-2 border-[#E96820] border-b-4 border-b-[#CC7700] shadow-lg active:translate-y-1 active:border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>В мир дизайна!</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </main>

      {/* 3. Футер со Спарком */}
      <footer className="w-full max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs font-bold text-white/90 drop-shadow-sm pb-2 z-10">
        <SparkEmotionSprite emotion="happy" size={44} />
        <span>Твой файл сохранения `.spark` можно использовать на любом устройстве!</span>
      </footer>
    </SkyBackground>
  );
};

export default Final;
