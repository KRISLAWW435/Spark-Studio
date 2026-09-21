import { Hand, LayoutTemplate, Layers, Type, Palette, MousePointer2, Box, LayoutGrid, Smartphone, Sparkles, Activity, FileText, Globe, GraduationCap, ArrowRightCircle } from 'lucide-react';

export const COURSE_MODULES = [
  {
    id: 'm0',
    title: 'Модуль 0: Мышление продуктового дизайнера',
    description: 'Законы UX: Фиттса, Хика, Миллера, Гештальт-принципы.',
    icon: Hand,
    lessons: [
      { id: 'm0-l1', title: 'Урок 0.1: Что такое UI/UX', path: '/course/m0-l1' },
      { id: 'm0-l2', title: 'Урок 0.2: Гештальт-принципы в дизайне', path: '/course/m0-l1' },
      { id: 'm0-l3', title: 'Урок 0.3: Когнитивные искажения', path: '/course/m0-l1' },
      { id: 'm0-l4', title: 'Урок 0.4: Продуктовый квиз главы', path: '/course/m0-l1' }
    ]
  },
  {
    id: 'm1',
    title: 'Модуль 1: Основы UI/UX',
    description: 'Основы эргономики, Закон Фиттса, интерфейсы.',
    icon: Activity,
    lessons: [
      { id: 'm1-l1', title: 'Урок 1.1: Закон Фиттса (Кнопка-Мишень)', path: '/course/m1-l1' },
      { id: 'm1-l2', title: 'Урок 1.2: Закон Хика (Выбор и время)', path: '/course/m1-l1' },
      { id: 'm1-l3', title: 'Урок 1.3: Закон Миллера (Память)', path: '/course/m1-l1' },
      { id: 'm1-l4', title: 'Урок 1.4: Практика в лаборатории кнопок', path: '/labs/button' }
    ]
  },
  {
    id: 'm2',
    title: 'Модуль 2: Информационная архитектура & UX Flow',
    description: 'Sitemap, User Flow, Wireframes.',
    icon: Layers,
    lessons: [
      { id: 'm2-l1', title: 'Урок 2.1: Ментальные модели пользователя', path: '#' },
      { id: 'm2-l2', title: 'Урок 2.2: Построение User Flow', path: '#' },
      { id: 'm2-l3', title: 'Урок 2.3: Вайрфреймы низкой точности', path: '#' }
    ]
  },
  {
    id: 'm3',
    title: 'Модуль 3: Композиция, Сетка & Отступы',
    description: '8pt Grid System, 12-column grid, Иерархия, Воздух.',
    icon: LayoutGrid,
    lessons: [
      { id: 'm3-l1', title: 'Урок 3.1: Правило внешнего и внутреннего', path: '#' },
      { id: 'm3-l2', title: 'Урок 3.2: 8pt сетка и вертикальный ритм', path: '#' },
      { id: 'm3-l3', title: 'Урок 3.3: Колонки и контейнеры', path: '#' }
    ]
  },
  {
    id: 'm4',
    title: 'Модуль 4: Типографика & Текстовая иерархия',
    description: 'Модульные шкалы, Line-height, Кернинг, Выключка.',
    icon: Type,
    lessons: [
      { id: 'm4-l1', title: 'Урок 4.1: Шрифтовые пары и анти-слап', path: '/labs/typography' },
      { id: 'm4-l2', title: 'Урок 4.2: Модульные шкалы типов', path: '/labs/typography' },
      { id: 'm4-l3', title: 'Урок 4.3: Практикум в лаборатории текста', path: '/labs/typography' }
    ]
  },
  {
    id: 'm5',
    title: 'Модуль 5: Лаборатория цвета & WCAG Доступность',
    description: 'Контрастность, Семантические цвета, a11y.',
    icon: Palette,
    lessons: [
      { id: 'm5-l1', title: 'Урок 5.1: Теория цвета в UI', path: '/labs/color' },
      { id: 'm5-l2', title: 'Урок 5.2: Стандарт WCAG AA и контраст', path: '/labs/color' },
      { id: 'm5-l3', title: 'Урок 5.3: Семантическая палитра', path: '/labs/color' }
    ]
  },
  {
    id: 'm6',
    title: 'Модуль 6: UI-Компоненты & Состояния',
    description: 'Кнопки, Инпуты, Карточки, Dropdown, Modals.',
    icon: MousePointer2,
    lessons: []
  },
  {
    id: 'm7',
    title: 'Модуль 7: Дизайн-системы & Figma Mastery',
    description: 'Auto Layout, Variables, Tokens, Атомарный дизайн.',
    icon: Box,
    lessons: []
  },
  {
    id: 'm8',
    title: 'Модуль 8: Сложные B2B-интерфейсы & Дашборды',
    description: 'Таблицы, Фильтры, Графики, Data Density.',
    icon: LayoutTemplate,
    lessons: []
  },
  {
    id: 'm9',
    title: 'Модуль 9: Mobile UI/UX & Native Guidelines',
    description: 'iOS Human Interface Guidelines, Android Material 3.',
    icon: Smartphone,
    lessons: []
  },
  {
    id: 'm10',
    title: 'Модуль 10: Motion & Микровзаимодействия',
    description: 'Framer Motion, Timing, Feedback, Easing curves.',
    icon: Sparkles,
    lessons: []
  },
  {
    id: 'm11',
    title: 'Модуль 11: UX-Тестирование & Метрики',
    description: 'Юзабилити-тесты, A/B тесты, SUS, CES, NPS.',
    icon: Activity,
    lessons: []
  },
  {
    id: 'm12',
    title: 'Модуль 12: Передача в разработку (Handoff)',
    description: 'QA макетов, Спецификации, Dev Mode, Токены.',
    icon: FileText,
    lessons: []
  },
  {
    id: 'm13',
    title: 'Модуль 13: Zero Block & Webflow',
    description: 'Адаптивная верстка под реальных клиентов.',
    icon: Globe,
    lessons: []
  },
  {
    id: 'm14',
    title: 'Модуль 14: Дипломный проект & AI-Защита',
    description: 'Разработка веб-сервиса от исследования до UI Kit.',
    icon: GraduationCap,
    lessons: [
      { id: 'm14-exam', title: 'Сдать финальный экзамен', path: '/mentor' }
    ]
  }
];
