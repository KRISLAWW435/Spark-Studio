// src/components/mascot/SparkEmotionSprite.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SparkEmotion, SPARK_EMOTION_CONFIG } from '../../data/sparkEmotions';

export interface SparkEmotionSpriteProps {
  emotion?: SparkEmotion;
  size?: number;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  showParticles?: boolean;
  imageSrc?: string; // Для будущей растровой графики
}

export const SparkEmotionSprite: React.FC<SparkEmotionSpriteProps> = ({
  emotion = 'idle',
  size = 220,
  className = '',
  onClick,
  interactive = true,
  showParticles = true,
  imageSrc
}) => {
  const config = SPARK_EMOTION_CONFIG[emotion] || SPARK_EMOTION_CONFIG.idle;

  // Если задан внешний растровый спрайт PNG/WebP
  const activeImageSrc = imageSrc || config.src;
  if (config.type === 'image' && activeImageSrc) {
    return (
      <div
        className={`relative select-none flex items-center justify-center ${className}`}
        style={{ width: size, height: size * 1.15 }}
        onClick={onClick}
      >
        <img
          src={activeImageSrc}
          alt={`Спарк (${config.label})`}
          className="w-full h-full object-contain filter drop-shadow-xl"
          draggable={false}
        />
      </div>
    );
  }

  // Настройка физических анимаций в зависимости от интенсивности
  const bounceTransition =
    config.bounceIntensity === 'energetic'
      ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
      : config.bounceIntensity === 'gentle'
      ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 0 };

  const bounceAnimate =
    config.bounceIntensity === 'energetic'
      ? { y: [-6, 6, -6], scale: [1, 1.04, 1] }
      : config.bounceIntensity === 'gentle'
      ? { y: [-3, 3, -3] }
      : { y: 0 };

  return (
    <motion.div
      id="spark-emotion-sprite"
      data-emotion={emotion}
      className={`relative select-none flex items-center justify-center ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.15}px` }}
      onClick={onClick}
      animate={bounceAnimate}
      transition={bounceTransition as any}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
    >
      {/* 1. Всплывающие частицы эмоций (Zzz, вопросики, сердечки, искры) */}
      {showParticles && (
        <AnimatePresence mode="wait">
          {config.particleEffect === 'question' && (
            <motion.div
              key="particle-question"
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: [-4, 4, -4], scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute -top-3 -right-2 text-3xl select-none filter drop-shadow-sm pointer-events-none"
            >
              ❓
            </motion.div>
          )}

          {config.particleEffect === 'zzz' && (
            <motion.div
              key="particle-zzz"
              initial={{ opacity: 0, y: 5, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-5, -28], x: [0, 10] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute -top-4 -right-1 text-2xl font-black text-indigo-400 select-none pointer-events-none"
            >
              💤
            </motion.div>
          )}

          {config.particleEffect === 'hearts' && (
            <motion.div
              key="particle-hearts"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute -top-2 -right-3 text-2xl select-none pointer-events-none"
            >
              💖
            </motion.div>
          )}

          {config.particleEffect === 'stars' && (
            <motion.div
              key="particle-stars"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute -top-3 -left-2 text-2xl select-none pointer-events-none"
            >
              ✨
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 2. Основной векторный SVG персонаж */}
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full filter drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Градиент цветного тела пламени */}
          <linearGradient id="sparkEmotionFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="25%" stopColor="#FFB300" />
            <stop offset="60%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#E64A19" />
          </linearGradient>

          {/* Внутреннее золотистое ядро пламени */}
          <linearGradient id="sparkEmotionCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF59D" />
            <stop offset="85%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFB74D" />
          </linearGradient>

          {/* Румянец */}
          <radialGradient id="sparkEmotionBlushGrad">
            <stop offset="0%" stopColor="#FF5252" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Лучики-искры вокруг огонька */}
        <g stroke="#FF7A00" strokeWidth="5" strokeLinecap="round" opacity={emotion === 'excited' ? 1 : 0.8}>
          <line x1="28" y1="62" x2="16" y2="58" />
          <line x1="25" y1="84" x2="12" y2="88" />
          <line x1="172" y1="68" x2="186" y2="64" />
          <line x1="174" y1="88" x2="188" y2="94" />
          {emotion === 'excited' && (
            <>
              <line x1="45" y1="36" x2="35" y2="24" />
              <line x1="155" y1="36" x2="165" y2="24" />
            </>
          )}
        </g>

        {/* Внешнее тело огненной капли-искры */}
        <path
          d="M 100 15 
             C 125 45, 175 90, 175 145 
             C 175 186, 141 220, 100 220 
             C 59 220, 25 186, 25 145 
             C 25 90, 75 45, 100 15 Z"
          fill="url(#sparkEmotionFlameGrad)"
          stroke="#E65100"
          strokeWidth="3.5"
        />

        {/* Внутреннее светящееся ядро */}
        <path
          d="M 100 48 
             C 118 70, 155 105, 155 148 
             C 155 178, 130 204, 100 204 
             C 70 204, 45 178, 45 148 
             C 45 105, 82 70, 100 48 Z"
          fill="url(#sparkEmotionCoreGrad)"
          opacity="0.9"
        />

        {/* Румянец на щечках */}
        <circle cx="58" cy="148" r="16" fill="url(#sparkEmotionBlushGrad)" />
        <circle cx="142" cy="148" r="16" fill="url(#sparkEmotionBlushGrad)" />

        {/* 3. Отрисовка глаз в зависимости от эмоции */}
        {/* HAPPY / PROUD: зажмуренные глазки-полумесяцы дугой вверх */}
        {(emotion === 'happy' || emotion === 'proud') && (
          <g stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none">
            <path d="M 66 128 Q 79 114 92 128" />
            <path d="M 108 128 Q 121 114 134 128" />
          </g>
        )}

        {/* SLEEPY: расслабленные горизонтальные веки */}
        {emotion === 'sleepy' && (
          <g stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none">
            <line x1="68" y1="126" x2="90" y2="128" />
            <line x1="110" y1="128" x2="132" y2="126" />
          </g>
        )}

        {/* PLAYFUL: один подмигивает (дугой), второй открыт */}
        {emotion === 'playful' && (
          <g>
            {/* Левый открытый глаз */}
            <circle cx="78" cy="124" r="15" fill="#1E293B" />
            <circle cx="74" cy="119" r="5.5" fill="#FFFFFF" />
            <circle cx="83" cy="128" r="2.5" fill="#FFFFFF" />
            {/* Правый подмигивающий глаз */}
            <path d="M 108 126 Q 121 114 134 126" stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* CONFUSED: один глаз выше/крупнее, второй меньше */}
        {emotion === 'confused' && (
          <g>
            <circle cx="76" cy="122" r="16" fill="#1E293B" />
            <circle cx="72" cy="117" r="5.5" fill="#FFFFFF" />
            <circle cx="124" cy="126" r="12" fill="#1E293B" />
            <circle cx="121" cy="123" r="4" fill="#FFFFFF" />
            {/* Кривые бровки */}
            <path d="M 65 102 Q 78 96 90 106" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 112 108 Q 124 100 136 104" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* SAD: грустные глазки со слезой */}
        {emotion === 'sad' && (
          <g>
            <circle cx="78" cy="128" r="14" fill="#1E293B" />
            <circle cx="76" cy="132" r="5" fill="#FFFFFF" />
            <circle cx="122" cy="128" r="14" fill="#1E293B" />
            <circle cx="120" cy="132" r="5" fill="#FFFFFF" />
            {/* Домиком брови */}
            <path d="M 66 108 Q 78 114 88 116" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 112 116 Q 122 114 134 108" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Капелька грусти */}
            <ellipse cx="140" cy="144" rx="3.5" ry="5.5" fill="#38BDF8" opacity="0.9" />
          </g>
        )}

        {/* SURPRISED: круглые широко распахнутые глаза */}
        {emotion === 'surprised' && (
          <g>
            <circle cx="76" cy="120" r="18" fill="#1E293B" />
            <circle cx="71" cy="114" r="7" fill="#FFFFFF" />
            <circle cx="81" cy="124" r="3.5" fill="#FFFFFF" />
            <circle cx="124" cy="120" r="18" fill="#1E293B" />
            <circle cx="119" cy="114" r="7" fill="#FFFFFF" />
            <circle cx="129" cy="124" r="3.5" fill="#FFFFFF" />
            {/* Высокие удивленные бровки */}
            <path d="M 64 96 Q 76 90 88 96" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 112 96 Q 124 90 136 96" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* THINKING: зрачки смотрят вверх и вправо */}
        {emotion === 'thinking' && (
          <g>
            <circle cx="78" cy="124" r="15" fill="#1E293B" />
            <circle cx="83" cy="118" r="5.5" fill="#FFFFFF" />
            <circle cx="122" cy="124" r="15" fill="#1E293B" />
            <circle cx="127" cy="118" r="5.5" fill="#FFFFFF" />
            {/* Одна бровь вздернута вверх */}
            <path d="M 66 106 Q 78 102 90 106" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 112 100 Q 124 94 136 102" stroke="#C2410C" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* EXCITED: глазки со звездными искорками */}
        {emotion === 'excited' && (
          <g>
            <circle cx="78" cy="122" r="16" fill="#1E293B" />
            {/* Звездочка в глазу */}
            <polygon points="78,114 80,119 85,121 80,123 78,128 76,123 71,121 76,119" fill="#FFF59D" />
            <circle cx="122" cy="122" r="16" fill="#1E293B" />
            <polygon points="122,114 124,119 129,121 124,123 122,128 120,123 115,121 120,119" fill="#FFF59D" />
          </g>
        )}

        {/* IDLE / WAVING: добрые круглые глазки с бликами */}
        {(emotion === 'idle' || emotion === 'waving') && (
          <g>
            <circle cx="78" cy="124" r="15" fill="#1E293B" />
            <circle cx="74" cy="119" r="5.5" fill="#FFFFFF" />
            <circle cx="83" cy="128" r="2.5" fill="#FFFFFF" />
            <circle cx="122" cy="124" r="15" fill="#1E293B" />
            <circle cx="118" cy="119" r="5.5" fill="#FFFFFF" />
            <circle cx="127" cy="128" r="2.5" fill="#FFFFFF" />
          </g>
        )}

        {/* 4. Отрисовка ротика в зависимости от эмоции */}
        {/* HAPPY / EXCITED / PROUD: широкая открытая улыбка с розовым язычком */}
        {(emotion === 'happy' || emotion === 'excited' || emotion === 'proud') && (
          <g>
            <path
              d="M 80 148 Q 100 174 120 148 Z"
              fill="#991B1B"
              stroke="#7F1D1D"
              strokeWidth="2.5"
            />
            {/* Розовый язычок */}
            <path d="M 88 158 Q 100 152 112 158 Q 100 172 88 158 Z" fill="#F472B6" />
          </g>
        )}

        {/* SURPRISED: круглый открытый ротик «О!» */}
        {emotion === 'surprised' && (
          <ellipse cx="100" cy="154" rx="7" ry="11" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" />
        )}

        {/* SAD: уголки губ опущены вниз */}
        {emotion === 'sad' && (
          <path d="M 86 160 Q 100 150 114 160" stroke="#7F1D1D" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        )}

        {/* PLAYFUL: хитрая улыбка с высунутым язычком */}
        {emotion === 'playful' && (
          <g>
            <path d="M 82 148 Q 100 166 118 150" stroke="#7F1D1D" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 98 156 Q 106 172 112 158 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
          </g>
        )}

        {/* CONFUSED: волнистая озадаченная линия */}
        {emotion === 'confused' && (
          <path d="M 86 154 Q 93 160 100 154 Q 107 148 114 154" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" fill="none" />
        )}

        {/* SLEEPY / THINKING / IDLE / WAVING: милая легкая улыбка */}
        {(emotion === 'idle' || emotion === 'waving' || emotion === 'sleepy' || emotion === 'thinking') && (
          <path
            d="M 84 150 Q 100 164 116 150"
            stroke="#7F1D1D"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* 5. Ручки Спарка */}
        {emotion === 'waving' ? (
          // Правая ручка поднята и машет
          <g stroke="#FF7A00" strokeWidth="6" strokeLinecap="round">
            {/* Левая ручка у тела */}
            <path d="M 40 160 Q 30 170 38 180" />
            {/* Правая ручка вверх и машет */}
            <path d="M 160 155 Q 176 130 180 112" />
          </g>
        ) : emotion === 'thinking' ? (
          // Правая ручка прижата к подбородку
          <g stroke="#FF7A00" strokeWidth="6" strokeLinecap="round">
            <path d="M 40 160 Q 30 170 38 180" />
            <path d="M 160 165 Q 148 165 130 158" />
          </g>
        ) : emotion === 'proud' ? (
          // Обе ручки в боки
          <g stroke="#FF7A00" strokeWidth="6" strokeLinecap="round">
            <path d="M 42 155 Q 24 165 38 178" />
            <path d="M 158 155 Q 176 165 162 178" />
          </g>
        ) : (
          // Стандартные ручки
          <g stroke="#FF7A00" strokeWidth="6" strokeLinecap="round">
            <path d="M 40 160 Q 28 170 36 182" />
            <path d="M 160 160 Q 172 170 164 182" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export default SparkEmotionSprite;
