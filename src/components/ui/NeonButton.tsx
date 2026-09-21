import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';
import { sound } from '../../utils/soundManager';

export interface NeonButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'solid' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  params?: string;
  icon?: React.ReactNode;
}

export function NeonButton({
  variant = 'solid',
  size = 'md',
  children,
  className,
  params,
  icon,
  disabled,
  ...props
}: NeonButtonProps) {
  const sizeClasses = {
    sm: 'h-9 px-4 text-xs rounded-xl gap-1.5',
    md: 'h-11 px-5 text-sm rounded-2xl gap-2',
    lg: 'h-13 px-7 text-base rounded-2xl gap-2.5',
  };

  const variantClasses = {
    solid: cn(
      // Фирменный оранжевый объемный стиль кнопки Duolingo (Цвет Спарка)
      "bg-[#FF9600] hover:bg-[#FF8800] text-white font-extrabold tracking-wide",
      "border-b-4 border-[#CC7700] active:border-b-0 active:translate-y-1 shadow-sm",
      "focus:ring-2 focus:ring-[#FF9600]/40"
    ),
    outline: cn(
      "bg-white hover:bg-slate-50 text-slate-700 font-extrabold tracking-wide",
      "border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 active:translate-y-0.5 shadow-sm",
      "focus:ring-2 focus:ring-slate-300"
    ),
    glass: cn(
      "bg-orange-50 hover:bg-orange-100 text-[#CC7700] font-extrabold tracking-wide",
      "border border-orange-200 border-b-4 border-b-orange-300 active:border-b-0 active:translate-y-1 shadow-sm",
      "focus:ring-2 focus:ring-orange-300"
    ),
  };

  return (
    <motion.button
      data-cursor="interactive"
      data-params={params}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={(e) => {
        sound.playClick();
        if (props.onClick) {
          props.onClick(e);
        }
      }}
      className={cn(
        "relative inline-flex items-center justify-center select-none transition-all duration-150 cursor-pointer",
        "focus:outline-none focus:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none disabled:border-b-0 disabled:translate-y-0 disabled:shadow-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
