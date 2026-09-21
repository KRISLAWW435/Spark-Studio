// src/components/ui/SkyBackground.tsx
import React from 'react';
import { motion } from 'motion/react';

interface SkyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  showSparkles?: boolean;
}

export const SkyBackground: React.FC<SkyBackgroundProps> = ({
  children,
  className = '',
  showSparkles = true
}) => {
  // 6 маленьких искр (точки 3-4px, opacity: 0.4, разбросаны по экрану)
  const sparkles = [
    { top: '14%', left: '15%', size: 3, delay: 0 },
    { top: '24%', right: '18%', size: 4, delay: 0.5 },
    { top: '46%', left: '10%', size: 3, delay: 1.0 },
    { top: '62%', right: '14%', size: 4, delay: 0.3 },
    { top: '78%', left: '25%', size: 3, delay: 0.8 },
    { top: '86%', right: '28%', size: 4, delay: 1.2 }
  ];

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none font-sans flex flex-col justify-between ${className}`}
      style={{
        background: 'linear-gradient(180deg, #58C9F3 0%, #36B3E8 100%)'
      }}
    >
      {/* 1. Мягкое свечение в правом верхнем углу (радиальный градиент, opacity: 0.15) */}
      <div
        className="absolute top-0 right-0 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
        }}
      />

      {/* 2. 5-7 маленьких искр (точки 3-4px, opacity: 0.4, без облаков) */}
      {showSparkles &&
        sparkles.map((sp, i) => (
          <motion.div
            key={`spark-${i}`}
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2.5 + (i % 3) * 0.5,
              repeat: Infinity,
              delay: sp.delay,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: sp.top,
              left: sp.left,
              right: sp.right,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              backgroundColor: '#FFFFFF',
              borderRadius: '9999px',
              pointerEvents: 'none'
            }}
          />
        ))}

      {/* Контент страницы */}
      {children}
    </div>
  );
};

export default SkyBackground;
