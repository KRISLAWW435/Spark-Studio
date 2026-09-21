// src/components/ui/ChoiceCard.tsx
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface ChoiceCardProps {
  selected: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  label: string;
  description?: string;
  colorPreview?: string;
  badge?: string;
  onClick: () => void;
  className?: string;
  id?: string;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  selected,
  disabled = false,
  icon,
  label,
  description,
  colorPreview,
  badge,
  onClick,
  className = '',
  id
}) => {
  return (
    <motion.div
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled}
      whileHover={!disabled ? { scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      onClick={() => {
        if (!disabled) onClick();
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative min-h-[48px] p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none text-left ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
          : selected
          ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/90 border-[#FF9600] border-b-4 border-b-[#E07A00] ring-3 ring-[#FF9600]/25 shadow-sm text-[#17345F]'
          : 'bg-slate-50/90 hover:bg-slate-100/90 border-slate-200 border-b-4 border-b-slate-300 text-slate-700 hover:border-slate-300 active:translate-y-0.5 active:border-b-2'
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Превью цвета, если передано */}
        {colorPreview && (
          <div
            className="w-7 h-7 rounded-xl border-2 border-white shadow-xs shrink-0 ring-1 ring-black/10"
            style={{ backgroundColor: colorPreview }}
          />
        )}

        {/* Иконка, если передана */}
        {icon && !colorPreview && (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              selected ? 'bg-[#FF9600]/15 text-[#FF9600]' : 'bg-slate-200/70 text-slate-600'
            }`}
          >
            {icon}
          </div>
        )}

        {/* Текстовый блок */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-black truncate ${
                selected ? 'text-[#17345F]' : 'text-slate-800'
              }`}
            >
              {label}
            </span>
            {badge && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p
              className={`text-[11px] sm:text-xs font-semibold mt-0.5 leading-snug line-clamp-2 ${
                selected ? 'text-amber-900/80' : 'text-slate-500'
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Индикатор выбора: галочка в кружочке */}
      <div className="shrink-0 ml-2">
        {selected ? (
          <div className="w-6 h-6 rounded-full bg-[#FF9600] text-white flex items-center justify-center shadow-xs">
            <Check size={15} strokeWidth={3.5} />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-300/80" />
        )}
      </div>
    </motion.div>
  );
};
