// src/data/worldMap.ts

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tag: string;
  description: string;
  greeting: string;
  color: string;
}

export interface WorldTask {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardItem?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  actionPath: string;
  actionLabel: string;
}

export interface WorldLocation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  zone: string;
  coordinates: {
    x: number; // 0..1000
    y: number; // 0..600
  };
  status: 'available' | 'locked' | 'completed';
  badge: string;
  buildingType: 'cafe' | 'lab' | 'studio' | 'tower' | 'citadel';
  character?: Character;
  tasks: WorldTask[];
  sparkQuote: string;
  theme: {
    primary: string;
    secondary: string;
    glow: string;
    badgeBg: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  source: string;
  acquiredAt?: string;
}

export interface PlayerWorldState {
  coins: number;
  backpack: InventoryItem[];
  completedTasks: string[];
  visitedLocations: string[];
}

export const INITIAL_PLAYER_STATE: PlayerWorldState = {
  coins: 120,
  backpack: [
    {
      id: 'starter_notebook',
      name: 'Блокнот исследователя',
      icon: '📓',
      description: 'Карманный скетчбук для быстрых UX-заметок и схем интерфейсов.',
      source: 'Стартовый набор Спарка'
    },
    {
      id: 'coffee_beans',
      name: 'Зерно вдохновения',
      icon: '☕',
      description: 'Ароматный подарок от Мари за интерес к удобным интерфейсам.',
      source: 'Кофейня Мари'
    }
  ],
  completedTasks: ['m0-task1'],
  visitedLocations: ['cafe_marie']
};

export const WORLD_LOCATIONS: WorldLocation[] = [
  // 1. Мари — Кофейня (Уютный квартал)
  {
    id: 'cafe_marie',
    title: 'Кофейня Мари',
    subtitle: 'Уютный квартал',
    description: 'Мари открыла небольшую авторскую кофейню, но клиенты путаются в мобильном заказе. Помоги ей исправить UX кнопки и меню!',
    zone: 'Квартал уюта',
    coordinates: { x: 220, y: 380 },
    status: 'available',
    badge: '2 задания',
    buildingType: 'cafe',
    character: {
      id: 'marie',
      name: 'Мари',
      role: 'Владелица кофейни & визионер',
      avatar: '👩‍🦰',
      tag: 'Клиентоориентированность',
      color: '#FF9600',
      description: 'Любит свежий капучино, минимализм и теплое человеческое общение.',
      greeting: 'Привет! Рада видеть тебя в моем кафе. Поможешь сделать приложение заказа таким же приятным, как утренний латте?'
    },
    tasks: [
      {
        id: 'marie_task_1',
        title: 'Большая кнопка заказа кофе',
        description: 'Исследуй разницу между чистым UI и удобным UX: сделай кнопку заказа заметной и легкой для нажатия.',
        rewardCoins: 50,
        rewardItem: {
          id: 'marie_cup',
          name: 'Фирменный стаканчик Мари',
          icon: '🥤',
          description: 'Удобная чашка, напоминающая: хороший UX утоляет жажду пользователя.'
        },
        actionPath: '/course/m0-l1',
        actionLabel: 'Открыть заказ кофе'
      },
      {
        id: 'marie_task_2',
        title: 'Контраст карточки капучино',
        description: 'Настрой правильные цветовые акценты и читаемость ценника для спешащих клиентов.',
        rewardCoins: 60,
        actionPath: '/labs/color',
        actionLabel: 'В лабораторию цвета'
      }
    ],
    sparkQuote: 'В кофейне Мари всегда пахнет корицей! Давай сделаем её кнопку заказа идеальной… Погнали?!',
    theme: {
      primary: '#FF9600',
      secondary: '#FFAA33',
      glow: 'rgba(255, 150, 0, 0.45)',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300'
    }
  },

  // 2. Кирилл — Техно-хаб (Технологический парк)
  {
    id: 'tech_kirill',
    title: 'Техно-хаб Кирилла',
    subtitle: 'Парк высоких технологий',
    description: 'Кирилл пишет фронтенд для сложных продуктов. Ему нужен строгий расчет расстояний, закон Фиттса и математически выверенные кнопки.',
    zone: 'Технопарк',
    coordinates: { x: 500, y: 220 },
    status: 'available',
    badge: '2 задания',
    buildingType: 'lab',
    character: {
      id: 'kirill',
      name: 'Кирилл',
      role: 'Frontend-архитектор & педант',
      avatar: '🧑‍💻',
      tag: 'Эргономика и сетки',
      color: '#1CB0F6',
      description: 'Строит дизайн-системы, уважает сетку 8pt и закон Фиттса. Ненавидит кнопки меньше 44px.',
      greeting: 'Приветствую, коллега! Красота без расчета бесполезна. Давай проверим размеры интерактивных областей!'
    },
    tasks: [
      {
        id: 'kirill_task_1',
        title: 'Калибровка кнопки-мишени (Фиттс)',
        description: 'Рассчитай идеальную высоту кнопки (48px) и внутренние отступы для большого пальца.',
        rewardCoins: 75,
        rewardItem: {
          id: 'pixel_ruler',
          name: 'Неоновая пиксельная линейка',
          icon: '📐',
          description: 'Артефакт Кирилла: гарантирует 48px для любой кнопки в приложении.'
        },
        actionPath: '/course/m1-l1',
        actionLabel: 'К тренажеру Фиттса'
      },
      {
        id: 'kirill_task_2',
        title: 'Анатомия кнопки и состояния',
        description: 'Создай кнопки с правильным Hover, Focus и Disabled в конструкторе.',
        rewardCoins: 65,
        actionPath: '/labs/button',
        actionLabel: 'Конструктор кнопок'
      }
    ],
    sparkQuote: 'Кирилл не прощает случайных отступов! Размер и расстояние до кнопки… решают абсолютно всё!',
    theme: {
      primary: '#1CB0F6',
      secondary: '#0090E0',
      glow: 'rgba(28, 176, 246, 0.45)',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300'
    }
  },

  // 3. Соня — Арт-мастерская (Творческий остров)
  {
    id: 'art_sonya',
    title: 'Мастерская Сони',
    subtitle: 'Творческий архипелаг',
    description: 'Соня создает визуальный язык современных брендов. Она покажет, как дружить шрифты с цветом и строить иерархию без визуального шума.',
    zone: 'Творческий остров',
    coordinates: { x: 780, y: 390 },
    status: 'available',
    badge: '2 задания',
    buildingType: 'studio',
    character: {
      id: 'sonya',
      name: 'Соня',
      role: 'Арт-лид & шрифтовой гуру',
      avatar: '👩‍🎨',
      tag: 'Типографика & Баланс',
      color: '#A435F0',
      description: 'Знает тайны анти-слап дизайна, модульных шкал и гармоничных палитр WCAG.',
      greeting: 'Салют! Дизайн говорит с нами шрифтом и цветом. Готов собрать стильную пару без визуального мусора?'
    },
    tasks: [
      {
        id: 'sonya_task_1',
        title: 'Шрифтовые пары и анти-слап',
        description: 'Подбери гармоничную модульную шкалу и выключку текста для главного заголовка.',
        rewardCoins: 80,
        rewardItem: {
          id: 'golden_palette',
          name: 'Палитра вдохновения Сони',
          icon: '🎨',
          description: 'Волшебный веер цветов с автоматической проверкой контраста WCAG AA.'
        },
        actionPath: '/labs/typography',
        actionLabel: 'Лаборатория текста'
      },
      {
        id: 'sonya_task_2',
        title: 'Цветовой контраст и читаемость',
        description: 'Проверь соотношение контраста текста к фону (минимум 4.5:1) и собери палитру.',
        rewardCoins: 70,
        actionPath: '/labs/color',
        actionLabel: 'Лаборатория цвета'
      }
    ],
    sparkQuote: 'У Сони в мастерской потрясающий свет! Научимся выбирать крутые шрифтовые пары… Погнали?!',
    theme: {
      primary: '#A435F0',
      secondary: '#8E24AA',
      glow: 'rgba(164, 53, 240, 0.45)',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  },

  // 4. Заглушка 1: Неоновый мегаполис
  {
    id: 'cyber_metropolis',
    title: 'Неоновый Мегаполис',
    subtitle: 'Крипто-квартал & FinTech',
    description: 'Центр сложных дашбордов, аналитических графиков и массивных дизайн-систем.',
    zone: 'Финансовый сектор',
    coordinates: { x: 380, y: 530 },
    status: 'locked',
    badge: 'Скоро в Спринте 2',
    buildingType: 'tower',
    tasks: [],
    sparkQuote: 'Этот квартал еще строится! Заверши задания Мари и Кирилла, чтобы получить пропуск.',
    theme: {
      primary: '#64748B',
      secondary: '#475569',
      glow: 'rgba(100, 116, 139, 0.3)',
      badgeBg: 'bg-slate-100 text-slate-600 border-slate-300'
    }
  },

  // 5. Заглушка 2: Башня Арт-директора (Финальная цитадель)
  {
    id: 'art_director_citadel',
    title: 'Башня Арт-директора',
    subtitle: 'Вершина мастерства',
    description: 'Экзаменационный центр, где строгий AI Арт-директор проведет финальный аудит твоего портфолио.',
    zone: 'Финальная цитадель',
    coordinates: { x: 670, y: 90 },
    status: 'locked',
    badge: 'Финальный босс',
    buildingType: 'citadel',
    tasks: [],
    sparkQuote: 'О-о-о! На самой вершине сидит Арт-директор… Туда пускают только с полным рюкзаком артефактов!',
    theme: {
      primary: '#94A3B8',
      secondary: '#64748B',
      glow: 'rgba(148, 163, 184, 0.3)',
      badgeBg: 'bg-slate-100 text-slate-500 border-slate-300'
    }
  }
];
