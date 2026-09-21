import { usePersistentState } from '../../hooks/usePersistentState';

export function TypographyLab() {
  const [baseSize, setBaseSize] = usePersistentState('typeLab_base', 16);
  const [scale, setScale] = usePersistentState('typeLab_scale', 1.25); // Major Third default

  const steps = [-1, 0, 1, 2, 3, 4, 5];
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">Лаборатория типографики</h1>
        <p className="text-text-muted">Исследуйте модульные шкалы и выстраивайте идеальную типографическую иерархию.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-6">
            <h2 className="text-xl font-semibold">Настройки шкалы</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Базовый размер (px)</span>
                  <span className="text-accent-blue">{baseSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="12" max="24" step="1"
                  value={baseSize}
                  onChange={(e) => setBaseSize(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Коэффициент масштаба</span>
                  <span className="text-accent-blue">{scale}</span>
                </div>
                <select 
                  value={scale} 
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full p-2 border border-border-soft rounded-ios-sm bg-bg-app text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  <option value={1.125}>Большая секунда (1.125)</option>
                  <option value={1.200}>Малая терция (1.200)</option>
                  <option value={1.250}>Большая терция (1.250)</option>
                  <option value={1.333}>Чистая кварта (1.333)</option>
                  <option value={1.414}>Увеличенная кварта (1.414)</option>
                  <option value={1.500}>Чистая квинта (1.500)</option>
                  <option value={1.618}>Золотое сечение (1.618)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-bg-surface p-8 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-8 overflow-x-auto">
            <div className="flex justify-between text-xs font-semibold text-text-muted uppercase tracking-wider pb-4 border-b border-border-soft">
              <span className="w-24 shrink-0">Шаг</span>
              <span className="w-24 shrink-0">Размер</span>
              <span className="flex-1 min-w-[200px]">Превью</span>
            </div>

            {steps.slice().reverse().map((step) => {
              const size = baseSize * Math.pow(scale, step);
              return (
                <div key={step} className="flex items-center gap-6">
                  <div className="w-24 shrink-0 text-sm font-medium text-text-muted">
                    {step === 0 ? 'База' : step > 0 ? `+${step}` : step}
                  </div>
                  <div className="w-24 shrink-0 text-sm font-mono text-accent-blue">
                    {size.toFixed(1)}px
                  </div>
                  <div 
                    className="flex-1 text-text-main truncate"
                    style={{ fontSize: `${size}px`, lineHeight: 1.2 }}
                  >
                    Съешь ещё этих мягких французских булок
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
