import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { usePersistentState } from '../../hooks/usePersistentState';

export function ButtonLab() {
  const [paddingX, setPaddingX] = usePersistentState('btnLab_px', 24);
  const [paddingY, setPaddingY] = usePersistentState('btnLab_py', 12);
  const [radius, setRadius] = usePersistentState('btnLab_radius', 12);
  const [buttonText, setButtonText] = usePersistentState('btnLab_text', 'Продолжить');
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">Конструктор кнопок</h1>
        <p className="text-text-muted">Проектируйте надежные интерактивные элементы с правильными размерами кликабельной зоны.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings size={20} /> Параметры
            </h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Текст на кнопке</label>
                <input 
                  type="text" 
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full p-2 border border-border-soft rounded-ios-sm bg-bg-app text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Внутренний отступ по горизонтали (X)</span>
                  <span className="text-accent-blue">{paddingX}px</span>
                </div>
                <input 
                  type="range" min="8" max="48" step="4"
                  value={paddingX} onChange={(e) => setPaddingX(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Внутренний отступ по вертикали (Y)</span>
                  <span className="text-accent-blue">{paddingY}px</span>
                </div>
                <input 
                  type="range" min="4" max="24" step="2"
                  value={paddingY} onChange={(e) => setPaddingY(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Радиус скругления (Border Radius)</span>
                  <span className="text-accent-blue">{radius}px</span>
                </div>
                <input 
                  type="range" min="0" max="32" step="2"
                  value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft flex flex-col items-center justify-center min-h-[400px]">
          
          <div className="relative p-12 border border-dashed border-border-soft rounded-xl bg-bg-app/50 flex flex-col items-center justify-center gap-8 w-full max-w-md">
            <span className="absolute top-4 left-4 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Рабочая область</span>
            
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#0066CC' }}
              whileTap={{ scale: 0.98 }}
              className="bg-accent-blue text-white font-medium shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-accent-blue/30 transition-colors"
              style={{
                padding: `${paddingY}px ${paddingX}px`,
                borderRadius: `${radius}px`
              }}
            >
              {buttonText}
            </motion.button>
            
            <div className="text-xs text-text-muted text-center max-w-[250px]">
              Наведите курсор, нажмите или используйте Tab для проверки микро-взаимодействий и состояний (Focus/Hover/Tap).
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
