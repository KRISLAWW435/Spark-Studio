# 🚀 Деплой на GitHub (GitHub Pages / Vercel / Render)

Проект настроен для автоматического деплоя на **GitHub Pages** с помощью GitHub Actions, а также готов к развертыванию на **Vercel**, **Netlify** или **Render**.

---

## 🌟 Вариант 1: GitHub Pages (Бесплатно, в 1 клик через GitHub Actions)

В проекте уже создан готовый workflow: `.github/workflows/deploy.yml`.

### Шаги для активации:
1. Создайте новый репозиторий на **GitHub** (или используйте существующий).
2. Выгрузите код из меню AI Studio (кнопка **Export to GitHub** в настройках) либо через git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ваш-юзернейм>/<имя-репозитория>.git
   git push -u origin main
   ```
3. Откройте репозиторий на GitHub:
   - Перейдите в **Settings** (Настройки) → **Pages** (слева в меню).
   - В разделе **Build and deployment** → **Source** выберите: **`GitHub Actions`**.
4. При каждом пуше в ветку `main` GitHub автоматически соберет проект и опубликует его по адресу:
   `https://<ваш-юзернейм>.github.io/<имя-репозитория>/`

---

## ⚡ Вариант 2: Vercel / Netlify (Рекомендуется для быстрого старта)

1. Зайдите на [vercel.com](https://vercel.com) или [netlify.com](https://netlify.com).
2. Подключите ваш GitHub репозиторий.
3. Настройки сборки определятся автоматически:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:client` (или `npm run build`)
   - **Output Directory**: `dist`
4. Если используется AI-экзаменатор (Gemini), добавьте переменную окружения в панели Vercel:
   `GEMINI_API_KEY` = `ваш_ключ`

---

## 🖥️ Вариант 3: Render / Railway / Docker (Для полного Full-Stack с Express сервером)

Если вы хотите запустить приложение вместе с бекендом Express:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port**: `3000`
