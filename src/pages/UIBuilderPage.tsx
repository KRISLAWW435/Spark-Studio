import { useState } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { LayoutTemplate, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

export function UIBuilderPage() {
  const [padding, setPadding] = usePersistentState('builder_padding', 24);
  const [radius, setRadius] = usePersistentState('builder_radius', 16);
  const [titleSize, setTitleSize] = usePersistentState('builder_titleSize', 20);
  const [shadow, setShadow] = usePersistentState('builder_shadow', 1);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shadowClasses = [
    'none',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  ];

  const generateCode = () => {
    return `<div className="bg-white flex flex-col max-w-sm w-full transition-all duration-200" style={{ padding: '${padding}px', borderRadius: '${radius}px', boxShadow: '${shadowClasses[shadow]}' }}>
  <div className="w-full h-32 bg-slate-100 rounded-md mb-4 flex items-center justify-center text-slate-300">
    [Image Area]
  </div>
  <h3 className="font-bold text-slate-900 mb-2 leading-tight" style={{ fontSize: '${titleSize}px' }}>
    Продуктовая карточка
  </h3>
  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
    Это интерактивный пример того, как отступы, скругления и типографика влияют на восприятие UI компонента.
  </p>
  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
    <span className="font-bold text-lg text-slate-900">$199</span>
    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
      В корзину
    </button>
  </div>
</div>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-2">UI Builder (Card Constructor)</h1>
        <p className="text-text-muted">Проектируйте идеальные карточки для интерфейсов на лету. Все сборки сохраняются локально.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bg-surface p-6 rounded-ios-lg shadow-ios-soft border border-border-soft space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <LayoutTemplate size={20} /> Токены дизайна
            </h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Внутренние отступы (Padding)</span>
                  <span className="text-accent-blue">{padding}px</span>
                </div>
                <input 
                  type="range" min="8" max="64" step="4"
                  value={padding} onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Скругление углов (Radius)</span>
                  <span className="text-accent-blue">{radius}px</span>
                </div>
                <input 
                  type="range" min="0" max="48" step="4"
                  value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Размер заголовка</span>
                  <span className="text-accent-blue">{titleSize}px</span>
                </div>
                <input 
                  type="range" min="14" max="32" step="2"
                  value={titleSize} onChange={(e) => setTitleSize(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Глубина тени (Elevation)</span>
                  <span className="text-accent-blue">Уровень {shadow}</span>
                </div>
                <input 
                  type="range" min="0" max="4" step="1"
                  value={shadow} onChange={(e) => setShadow(Number(e.target.value))}
                  className="w-full accent-accent-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className={isFullscreen ? "fixed inset-0 z-50 bg-bg-app flex items-center justify-center p-4" : "lg:col-span-8 bg-bg-app border border-dashed border-border-soft rounded-ios-xl min-h-[500px] flex items-center justify-center p-8 relative"}>
          
          {/* Toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 bg-white/80 backdrop-blur border border-border-soft px-3 py-1.5 rounded-full text-sm font-medium text-text-main shadow-sm hover:bg-white transition-colors"
            >
              {isCopied ? <Check size={16} className="text-accent-green" /> : <Copy size={16} />}
              <span className="hidden sm:inline">{isCopied ? 'Скопировано!' : 'React / Tailwind'}</span>
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center justify-center w-8 h-8 bg-white/80 backdrop-blur border border-border-soft rounded-full text-text-main shadow-sm hover:bg-white transition-colors"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Constructed Card */}
          <div 
            className="bg-white transition-all duration-200 ease-out flex flex-col max-w-sm w-full"
            style={{
              padding: `${padding}px`,
              borderRadius: `${radius}px`,
              boxShadow: shadowClasses[shadow]
            }}
          >
            <div className="w-full h-32 bg-slate-100 rounded-md mb-4 flex items-center justify-center text-slate-300">
              [Image Area]
            </div>
            <h3 className="font-bold text-slate-900 mb-2 leading-tight" style={{ fontSize: `${titleSize}px` }}>
              Продуктовая карточка
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Это интерактивный пример того, как отступы, скругления и типографика влияют на восприятие UI компонента.
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <span className="font-bold text-lg text-slate-900">$199</span>
              <button className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg">
                В корзину
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
