// src/data/terminology.ts

export interface DesignTerm {
  id: string;
  technicalTerm: string;
  childTerm: string;
  question: string;
  simpleExplanation: string;
  fullExplanation: string;
  icon: string;
  color: string;
}

export const DESIGN_TERMS: Record<string, DesignTerm> = {
  contrast: {
    id: 'contrast',
    technicalTerm: 'Контраст',
    childTerm: 'Заметность',
    question: 'Видно или сливается?',
    simpleExplanation: 'Когда яркая кнопка сразу выделяется на спокойном фоне.',
    fullExplanation:
      'Контраст — это разница между цветами. Если текст серый на сером фоне — его трудно прочитать. А если кнопка сочная и яркая — её заметит любой!',
    icon: '👁️',
    color: '#FF9600'
  },
  usability: {
    id: 'usability',
    technicalTerm: 'Юзабилити (UX)',
    childTerm: 'Удобство',
    question: 'Легко ли нажать и найти?',
    simpleExplanation: 'Когда всё под рукой и не нужно думать, куда нажимать.',
    fullExplanation:
      'Юзабилити — это удобство для человека. Кнопка должна быть достаточно большой, чтобы пальчик не промахнулся, а текст — понятным с первого взгляда.',
    icon: '👍',
    color: '#10B981'
  },
  cta: {
    id: 'cta',
    technicalTerm: 'CTA (Call to Action)',
    childTerm: 'Кнопка действия',
    question: 'Что произойдёт, если нажать?',
    simpleExplanation: 'Самая главная кнопка, которая зовёт сделать действие.',
    fullExplanation:
      'CTA переводится как «призыв к действию». Это кнопка, которая говорит: «Купить игрушку», «Играть» или «Забрать приз». Она должна манить к себе!',
    icon: '🎯',
    color: '#8B5CF6'
  },
  interface: {
    id: 'interface',
    technicalTerm: 'Интерфейс (UI)',
    childTerm: 'Лицо программы',
    question: 'Что мы видим на экране?',
    simpleExplanation: 'Все кнопочки, полочки, картинки и меню, которыми мы управляем.',
    fullExplanation:
      'Интерфейс — это мостик между тобой и компьютером. Красивые цвета, ровные шрифты и плавные анимации делают интерфейс приятным для глаз.',
    icon: '📱',
    color: '#0EA5E9'
  },
  hierarchy: {
    id: 'hierarchy',
    technicalTerm: 'Визуальная иерархия',
    childTerm: 'Главное и второстепенное',
    question: 'Куда взгляд падает в первую секунду?',
    simpleExplanation: 'Самое важное — крупно и ярко, а подробности — чуть меньше.',
    fullExplanation:
      'Иерархия помогает не потеряться. Сначала взгляд видит главное название и большую кнопку, а уже потом читает мелкие надписи.',
    icon: '📐',
    color: '#EC4899'
  }
};
