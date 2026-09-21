import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  params?: string;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  interactive = false,
  params,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      data-cursor={interactive ? 'interactive' : undefined}
      data-params={params}
      whileHover={interactive ? { y: -2, transition: { duration: 0.15 } } : undefined}
      className={cn(
        // Чистая светлая карточка в стиле Duolingo
        "relative rounded-2xl transition-all duration-200",
        "bg-white border border-slate-200",
        "shadow-sm hover:shadow-md",
        interactive && "cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
