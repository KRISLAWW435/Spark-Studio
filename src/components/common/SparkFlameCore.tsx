// src/components/common/SparkFlameCore.tsx
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export type SparkEmotionType = 
  | 'idle' 
  | 'happy' 
  | 'excited' 
  | 'ecstatic' 
  | 'thinking' 
  | 'sleeping' 
  | 'locked' 
  | 'error' 
  | 'winking' 
  | 'neutral';

export interface SparkFlameCoreProps {
  emotion?: SparkEmotionType;
  size?: number;
  className?: string;
  isSpeaking?: boolean;
  message?: string;
  waving?: boolean; // Всегда махать ручкой (как на фото в правом нижнем углу карты)
  standingOnCloud?: boolean; // Рендерить пушистое облачко под ножками
  showBubble?: boolean;
  bubbleText?: string;
  onBubbleClick?: () => void;
  colorVariant?: 'orange' | 'cyan' | 'gray';
}

/**
 * Канонический маскот «Спарк • Огонёк» — 1-в-1 по 2D-референсу Casual Game
 */
export function SparkFlameCore({
  emotion = 'idle',
  size = 120,
  className,
  isSpeaking = false,
  message,
  waving = true,
  standingOnCloud = false,
  showBubble = false,
  bubbleText = 'Куда пойдём?',
  onBubbleClick,
  colorVariant = 'orange',
}: SparkFlameCoreProps) {
  const shouldReduce = useReducedMotion();

  const isSleeping = emotion === 'sleeping' || emotion === 'locked';
  const isHappy = emotion === 'happy' || emotion === 'ecstatic' || emotion === 'excited';
  const isThinking = emotion === 'thinking';
  const isWinking = emotion === 'winking';

  const uid = Math.random().toString(36).substring(2, 8);
  const outerGradId = `spark-flame-outer-${uid}`;
  const innerGradId = `spark-flame-inner-${uid}`;
  const glowId = `spark-flame-glow-${uid}`;

  // Высота пропорциональна оригинальному соотношению (200 x 220)
  const height = (size * 220) / 200;

  // Анимация дыхания и легкого парения
  const bodyY = shouldReduce ? 0 : isHappy ? [0, -8, 0] : isSpeaking ? [0, -6, 0] : [0, -4, 0];
  const bodyRotate = shouldReduce ? 0 : isThinking ? [-3, 3, -3] : isSpeaking ? [-2, 2, -2] : [0, 1, -1, 0];

  return (
    <div className={cn("relative inline-flex flex-col items-center select-none", className)}>
      {/* Речевой баббл (если передан message или showBubble) */}
      {(message || (showBubble && bubbleText)) && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.92 }}
          onClick={onBubbleClick}
          className={cn(
            "bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-200/90 text-slate-800 font-black text-sm z-30 mb-2.5 relative max-w-[220px] text-center flex items-center justify-center gap-1.5",
            onBubbleClick && "cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          )}
        >
          <span>{message || bubbleText}</span>
          {/* Хвостик баббла вниз */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-white drop-shadow-xs" />
        </motion.div>
      )}

      <motion.div
        animate={{ y: bodyY, rotate: bodyRotate }}
        transition={{ 
          duration: isSpeaking ? 0.45 : isHappy ? 1.1 : isThinking ? 2.2 : 2.6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ width: size, height }}
        className="relative"
      >
        <svg
          viewBox="0 0 200 220"
          width={size}
          height={height}
          className="overflow-visible"
        >
          <defs>
            {/* Внешний градиент пламени */}
            <linearGradient id={outerGradId} x1="30%" y1="0%" x2="70%" y2="100%">
              {colorVariant === 'cyan' ? (
                <>
                  <stop offset="0%" stopColor="#A5F3FC" />
                  <stop offset="35%" stopColor="#38BDF8" />
                  <stop offset="75%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0369A1" />
                </>
              ) : isSleeping || colorVariant === 'gray' ? (
                <>
                  <stop offset="0%" stopColor="#E2E8F0" />
                  <stop offset="50%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#64748B" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="25%" stopColor="#FBBF24" />
                  <stop offset="55%" stopColor="#FB923C" />
                  <stop offset="85%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#E11D48" />
                </>
              )}
            </linearGradient>

            {/* Внутреннее светящееся теплое ядро */}
            <linearGradient id={innerGradId} x1="50%" y1="15%" x2="50%" y2="90%">
              {colorVariant === 'cyan' ? (
                <>
                  <stop offset="0%" stopColor="#E0F2FE" />
                  <stop offset="60%" stopColor="#BAE6FD" />
                  <stop offset="100%" stopColor="#7DD3FC" />
                </>
              ) : isSleeping || colorVariant === 'gray' ? (
                <>
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="45%" stopColor="#FDE047" />
                  <stop offset="85%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </>
              )}
            </linearGradient>

            {/* Мягкое свечение ауры пламени */}
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Облачко под ножками (если включено) */}
          {standingOnCloud && (
            <g transform="translate(45, 172)" opacity="0.95">
              <ellipse cx="55" cy="20" rx="65" ry="16" fill="#FFFFFF" />
              <ellipse cx="30" cy="12" rx="28" ry="14" fill="#FFFFFF" />
              <ellipse cx="80" cy="12" rx="28" ry="14" fill="#FFFFFF" />
              <ellipse cx="55" cy="6" rx="35" ry="15" fill="#FFFFFF" />
              <ellipse cx="55" cy="24" rx="50" ry="8" fill="#BAE6FD" opacity="0.5" />
            </g>
          )}

          {/* Тень под ножками */}
          <ellipse
            cx="100"
            cy="195"
            rx="36"
            ry="6"
            fill="rgba(15, 23, 42, 0.18)"
          />

          {/* 2. Ножки Спарка (стоят на облачке/земле) */}
          <g id="spark-feet">
            {/* Левая ножка */}
            <ellipse
              cx="82"
              cy="184"
              rx="11"
              ry="8"
              fill={colorVariant === 'cyan' ? '#0369A1' : isSleeping ? '#64748B' : '#C2410C'}
            />
            {/* Правая ножка */}
            <ellipse
              cx="118"
              cy="184"
              rx="11"
              ry="8"
              fill={colorVariant === 'cyan' ? '#0369A1' : isSleeping ? '#64748B' : '#C2410C'}
            />
          </g>

          {/* 3. Левая рука */}
          <g id="spark-left-arm">
            <path
              d="M 50 128 Q 32 138 34 150"
              stroke={colorVariant === 'cyan' ? '#0284C7' : isSleeping ? '#64748B' : '#EA580C'}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <circle
              cx="34"
              cy="150"
              r="4.5"
              fill={colorVariant === 'cyan' ? '#0284C7' : isSleeping ? '#64748B' : '#EA580C'}
            />
          </g>

          {/* 4. ОСНОВНОЕ ТЕЛО ОГОНЬКА (Точный силуэт пламени с референса!) */}
          <g filter={`url(#${glowId})`}>
            {/* Внешний контур пламени с зубцами-язычками */}
            <path
              d="
                M 100 16
                C 108 26, 118 42, 118 52
                C 122 46, 128 38, 136 34
                C 134 46, 132 58, 130 68
                C 142 64, 154 74, 158 88
                C 152 96, 144 98, 138 100
                C 152 110, 162 128, 160 148
                C 158 172, 132 186, 100 186
                C 68 186, 42 172, 40 148
                C 38 128, 48 110, 62 100
                C 56 98, 48 96, 42 88
                C 46 74, 58 64, 70 68
                C 68 58, 66 46, 64 34
                C 72 38, 78 46, 82 52
                C 82 42, 92 26, 100 16 Z
              "
              fill={`url(#${outerGradId})`}
              stroke={isSleeping ? '#94A3B8' : '#EA580C'}
              strokeWidth="2"
            />

            {/* Внутреннее теплое золотое пламя (Сердцевина) */}
            <path
              d="
                M 100 38
                C 106 48, 114 62, 114 70
                C 118 64, 122 58, 128 54
                C 126 64, 124 74, 122 82
                C 132 78, 142 86, 144 98
                C 138 104, 132 106, 128 108
                C 138 118, 146 132, 144 148
                C 142 168, 124 178, 100 178
                C 76 178, 58 168, 56 148
                C 54 132, 62 118, 72 108
                C 68 106, 62 104, 56 98
                C 58 86, 68 78, 78 82
                C 76 74, 74 64, 72 54
                C 78 58, 82 64, 86 70
                C 86 62, 94 48, 100 38 Z
              "
              fill={`url(#${innerGradId})`}
              opacity={isSleeping ? 0.4 : 0.88}
            />

            {/* Легкий светлый блик на макушке */}
            <ellipse
              cx="100"
              cy="60"
              rx="18"
              ry="24"
              fill="#FFFFFF"
              opacity={isSleeping ? 0.1 : 0.25}
            />
          </g>

          {/* 5. Правая рука (приподнята и приветливо машет, как на фото) */}
          <g id="spark-right-arm">
            {waving ? (
              <motion.g
                animate={shouldReduce ? undefined : { rotate: [-14, 10, -14] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: '150px 128px', transformBox: 'fill-box' }}
              >
                <path
                  d="M 150 128 Q 170 115 174 98"
                  stroke={colorVariant === 'cyan' ? '#0284C7' : isSleeping ? '#64748B' : '#EA580C'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle
                  cx="174"
                  cy="98"
                  r="5"
                  fill={colorVariant === 'cyan' ? '#0284C7' : isSleeping ? '#64748B' : '#EA580C'}
                />
              </motion.g>
            ) : (
              <g>
                <path
                  d="M 150 128 Q 166 138 164 150"
                  stroke={colorVariant === 'cyan' ? '#0284C7' : isSleeping ? '#64748B' : '#EA580C'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle
                  cx="164"
                  cy="150"
                  r="4.5"
                  fill={colorVariant === 'cyan' ? '#0284C7' : isSleeping ? '#64748B' : '#EA580C'}
                />
              </g>
            )}
          </g>

          {/* 6. Румяные розовые щечки (крупные, мультяшные как на фото) */}
          {!isSleeping && (
            <g id="spark-cheeks">
              <ellipse cx="68" cy="136" rx="9" ry="5.5" fill="#FB7185" opacity="0.65" />
              <ellipse cx="132" cy="136" rx="9" ry="5.5" fill="#FB7185" opacity="0.65" />
            </g>
          )}

          {/* 7. ГЛАЗКИ (Глубокие темные овалы с большими белыми бликами точно по фото) */}
          {isSleeping ? (
            <g id="eyes-sleeping">
              <path d="M 72 124 Q 82 130 92 124" stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 108 124 Q 118 130 128 124" stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none" />
              <text x="135" y="95" fontSize="18" fontWeight="900" fill="#94A3B8">Zzz</text>
            </g>
          ) : isWinking ? (
            <g id="eyes-winking">
              <path d="M 72 122 Q 82 114 92 122" stroke="#1C1917" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Правый открытый глаз */}
              <ellipse cx="118" cy="122" rx="8" ry="11" fill="#1C1917" />
              <circle cx="121" cy="118" r="3.8" fill="#FFFFFF" />
              <circle cx="115" cy="126" r="1.8" fill="#FFFFFF" />
            </g>
          ) : isHappy ? (
            <g id="eyes-happy">
              {/* Радостные кавайные глазки-дуги или сверкающие овалы */}
              <ellipse cx="82" cy="122" rx="8.5" ry="11.5" fill="#1C1917" />
              <circle cx="85" cy="118" r="4" fill="#FFFFFF" />
              <circle cx="79" cy="126" r="2" fill="#FFFFFF" />

              <ellipse cx="118" cy="122" rx="8.5" ry="11.5" fill="#1C1917" />
              <circle cx="121" cy="118" r="4" fill="#FFFFFF" />
              <circle cx="115" cy="126" r="2" fill="#FFFFFF" />
            </g>
          ) : (
            <g id="eyes-standard">
              {/* Левый глаз */}
              <ellipse cx="82" cy="122" rx="8" ry="11" fill="#1C1917" />
              <circle cx="85" cy="118" r="3.8" fill="#FFFFFF" />
              <circle cx="79" cy="126" r="1.8" fill="#FFFFFF" />

              {/* Правый глаз */}
              <ellipse cx="118" cy="122" rx="8" ry="11" fill="#1C1917" />
              <circle cx="121" cy="118" r="3.8" fill="#FFFFFF" />
              <circle cx="115" cy="126" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* 8. РОТИК (Аккуратная мультяшная улыбка по центру) */}
          {isSpeaking ? (
            <g id="mouth-speaking">
              <ellipse cx="100" cy="136" rx="7" ry="8" fill="#1C1917" />
              <ellipse cx="100" cy="138" rx="4.5" ry="4" fill="#FB7185" />
            </g>
          ) : isThinking ? (
            <path
              d="M 94 136 Q 100 133 106 137"
              stroke="#1C1917"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M 93 134 Q 100 142 107 134"
              stroke="#1C1917"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Искорки настроения (для радости/активности) */}
          {isHappy && (
            <g id="sparkle-stars">
              <polygon points="165,60 168,67 175,69 168,71 165,78 162,71 155,69 162,67" fill="#FDE047" />
              <polygon points="35,80 37,85 42,86 37,87 35,92 33,87 28,86 33,85" fill="#FDE047" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
