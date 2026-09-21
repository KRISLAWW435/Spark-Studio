// scripts/generate-spark-voices.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { SPARK_MENU_PHRASES } from '../src/data/sparkMenuPhrases.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../public/audio/spark');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`🎙️ Запуск генерации ${SPARK_MENU_PHRASES.length} реплик Спарка...`);
console.log(`📁 Директория: ${OUTPUT_DIR}\n`);

async function generateAll() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('ru-RU-SvetlanaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const item of SPARK_MENU_PHRASES) {
    const filePath = path.join(OUTPUT_DIR, `${item.id}.mp3`);

    const cleanText = item.text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();

    console.log(`⏳ [${item.id}] Генерация: "${cleanText}"`);

    try {
      const { audioStream } = tts.toStream(cleanText, {
        rate: '+3%',
        pitch: '+4Hz',
      });

      const writeStream = fs.createWriteStream(filePath);
      audioStream.pipe(writeStream);

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', () => {
          const stats = fs.statSync(filePath);
          console.log(`✅ [${item.id}] Сохранено: ${item.id}.mp3 (${stats.size} байт)\n`);
          resolve();
        });
        audioStream.on('error', reject);
        writeStream.on('error', reject);
      });
    } catch (error) {
      console.error(`❌ Ошибка генерации для ${item.id}:`, error);
    }
  }

  tts.close();
  console.log('🎉 Все 12 реплик успешно сгенерированы в public/audio/spark/ !');
}

generateAll().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
