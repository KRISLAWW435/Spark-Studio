import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getAI() {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  app.post('/api/exam/generate', async (req, res) => {
    try {
      const ai = getAI();
      if (!ai) return res.status(500).json({ error: 'AI_KEY_MISSING' });
      
      const prompt = `Ты строгий Арт-директор и ментор по UI/UX дизайну. 
Сгенерируй для студента короткую практическую бизнес-задачу или сценарий с подвохом (максимум 3 предложения). 
Например: "Клиент просит добавить 15 полей ввода на первый экран мобильного приложения. Как ты обоснуешь отказ и что предложишь взамен?".
Отвечай только текстом задачи, без лишних вступлений.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      res.json({ scenario: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Failed to generate scenario.' });
    }
  });

  app.post('/api/exam/grade', async (req, res) => {
    try {
      const ai = getAI();
      if (!ai) return res.status(500).json({ error: 'AI_KEY_MISSING' });
      
      const { scenario, answer } = req.body;
      if (!scenario || !answer) return res.status(400).json({ error: 'Missing parameters' });
      
      const prompt = `Ты строгий Арт-директор и ментор по UI/UX дизайну.
Сценарий/задача студенту: "${scenario}"
Ответ студента: "${answer}"

Твоя задача:
1. Оценить ответ по 5-балльной шкале (Оценка: X/5).
2. Дать краткий, конструктивный фидбек (что хорошо, что забыл учесть, как сделать лучше).
Не хвали просто так, будь профессионалом.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      res.json({ feedback: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Failed to grade answer.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
