import { useState } from 'react';
import { BrainCircuit, Loader2, PlayCircle, Send, CheckCircle2 } from 'lucide-react';

export function AiMentorPage() {
  const [scenario, setScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const requestExamScenario = async () => {
    setLoading(true);
    setFeedback(null);
    setAnswer('');
    
    try {
      const res = await fetch('/api/exam/generate', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScenario(data.scenario);
    } catch (err: any) {
      if (err.message === 'AI_KEY_MISSING') {
        // Fallback offline mentor
        setScenario("КЛИЕНТ (ОФФЛАЙН РЕЖИМ): У нас есть форма регистрации из 14 полей (Имя, Фамилия, Отчество, Индекс, Город, Адрес...). Я хочу, чтобы все они были на одном экране смартфона без прокрутки. Сделай шрифт 8px. Как ты ответишь клиенту?");
      } else {
        alert('Ошибка генерации сценария: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/exam/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, answer })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeedback(data.feedback);
    } catch (err: any) {
      if (err.message === 'AI_KEY_MISSING') {
        // Fallback feedback
        setFeedback("ОФФЛАЙН МЕНТОР:\nОценка: 4/5.\nХорошо, что ты аргументируешь решение. Однако стоит упомянуть правило Миллера (кошелек памяти 7±2) и предложить разбить форму на шаги (Progressive Disclosure). Также шрифт 8px недопустим по гайдлайнам iOS/Android (минимум 14-16px).");
      } else {
        alert('Ошибка проверки ответа: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl mx-auto">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mx-auto">
          <BrainCircuit size={16} />
          <span>Экзаменатор Gemini AI</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-main">
          Университетский Экзамен
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
          Проверьте свои знания в роли арт-директора. ИИ сгенерирует сложную ситуацию из реальной бизнес-практики, а вам нужно аргументированно её решить.
        </p>
      </header>

      {!scenario ? (
        <div className="bg-bg-surface p-12 rounded-ios-xl shadow-ios-soft border border-border-soft flex flex-col items-center justify-center text-center">
          <BrainCircuit size={48} className="text-accent-blue mb-6 opacity-80" />
          <h2 className="text-2xl font-semibold mb-2">Готовы к испытанию?</h2>
          <p className="text-text-muted mb-8 max-w-md">Gemini придумает реальную проблему клиента. Постарайтесь ответить развернуто, используя термины из курса (UX-законы, сетка, WCAG).</p>
          <button 
            onClick={requestExamScenario}
            disabled={loading}
            className="flex items-center gap-2 bg-accent-blue text-white px-8 py-4 rounded-full font-semibold shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PlayCircle />}
            Сгенерировать бизнес-задачу
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50/50 p-6 md:p-8 rounded-ios-xl border border-blue-100 relative">
             <div className="absolute top-4 left-4 text-xs font-bold text-accent-blue uppercase tracking-wider">Сообщение от клиента</div>
             <p className="mt-4 text-lg text-text-main font-medium italic">«{scenario}»</p>
          </div>

          {!feedback ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-text-main ml-1">Ваш аргументированный ответ арт-директора:</label>
              <textarea 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Я бы объяснил клиенту, что..."
                className="w-full h-40 p-4 rounded-ios-lg border border-border-soft bg-bg-surface focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none shadow-inner"
              />
              <button 
                onClick={submitAnswer}
                disabled={loading || answer.length < 10}
                className="flex items-center gap-2 bg-text-main text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-black transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                Сдать на проверку AI Ментору
              </button>
            </div>
          ) : (
            <div className="bg-bg-surface p-6 md:p-8 rounded-ios-xl border border-border-soft shadow-ios-soft">
               <div className="flex items-center gap-2 mb-4">
                 <CheckCircle2 className="text-accent-green" size={24} />
                 <h3 className="text-xl font-bold">Оценка и Фидбек от ИИ</h3>
               </div>
               <div className="prose prose-blue max-w-none text-text-main whitespace-pre-wrap">
                 {feedback}
               </div>
               <button 
                onClick={requestExamScenario}
                className="mt-8 text-sm font-medium text-accent-blue hover:underline"
               >
                 Сдать еще один экзамен
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
