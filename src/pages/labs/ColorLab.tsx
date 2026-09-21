import { usePersistentState } from '../../hooks/usePersistentState';
import { getContrastRatio } from '../../lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

export function ColorLab() {
  const [fgColor, setFgColor] = usePersistentState('colorLab_fg', '#1C1C1E');
  const [bgColor, setBgColor] = usePersistentState('colorLab_bg', '#FFFFFF');

  const contrast = getContrastRatio(fgColor, bgColor);
  const aaNormal = contrast >= 4.5;
  const aaLarge = contrast >= 3.0;
  const aaaNormal = contrast >= 7.0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">Лаборатория цвета</h1>
        <p className="text-text-muted">Проверяйте контрастность цветов и доступность интерфейса в реальном времени.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-6">
            <h2 className="text-xl font-semibold">Выбор цвета</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-main">Цвет текста (Foreground)</label>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-text-muted uppercase">{fgColor}</span>
                  <input 
                    type="color" 
                    value={fgColor} 
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-main">Цвет фона (Background)</label>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-text-muted uppercase">{bgColor}</span>
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-6">
            <h2 className="text-xl font-semibold flex items-center justify-between">
              Коэффициент контраста
              <span className="text-2xl font-bold tracking-tight">{contrast.toFixed(2)}:1</span>
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <WCAGBadge label="AA Обычный" pass={aaNormal} />
              <WCAGBadge label="AA Крупный" pass={aaLarge} />
              <WCAGBadge label="AAA Обычный" pass={aaaNormal} />
            </div>
          </div>
        </div>

        <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Интерактивный предпросмотр</h2>
          <div 
            className="flex-1 rounded-ios-md p-8 flex flex-col justify-center space-y-4 transition-colors duration-200 shadow-inner"
            style={{ backgroundColor: bgColor, color: fgColor }}
          >
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">Съешь ещё этих мягких французских булок, да выпей чаю</h3>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              Это стандартный текст, используемый для проверки того, как выбранная комбинация цветов выглядит в реальном сценарии. 
              Хорошая контрастность жизненно важна для читаемости и доступности вашего интерфейса.
            </p>
            <button 
              className="px-6 py-3 rounded-full font-medium self-start transition-opacity hover:opacity-80 mt-4"
              style={{ backgroundColor: fgColor, color: bgColor }}
            >
              Тестовая кнопка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WCAGBadge({ label, pass }: { label: string, pass: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 text-center rounded-ios-md border ${pass ? 'border-accent-green/20 bg-accent-green/5' : 'border-red-500/20 bg-red-500/5'}`}>
      {pass ? <CheckCircle2 className="text-accent-green mb-2" size={24} /> : <XCircle className="text-red-500 mb-2" size={24} />}
      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</span>
      <span className={`text-sm mt-1 font-medium ${pass ? 'text-accent-green' : 'text-red-600'}`}>
        {pass ? 'Пройдено' : 'Провал'}
      </span>
    </div>
  );
}
