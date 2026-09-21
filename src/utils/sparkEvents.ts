// src/utils/sparkEvents.ts
import { useState, useEffect } from 'react';
import { SparkEmotion } from '../data/sparkEmotions';

export type SparkEvent =
  | 'START_TASK'
  | 'CORRECT_ANSWER'
  | 'WRONG_ANSWER'
  | 'FIND_PROBLEM'
  | 'ALL_PROBLEMS_FOUND'
  | 'STUDIO_OPEN'
  | 'TAP_MASCOT'
  | 'IDLE_WAIT'
  | 'CONFUSED'
  | 'WAVE_HELLO'
  | 'SURPRISE'
  | 'RESET';

export const EVENT_TO_EMOTION: Record<SparkEvent, SparkEmotion> = {
  START_TASK: 'thinking',
  CORRECT_ANSWER: 'happy',
  WRONG_ANSWER: 'sad',
  FIND_PROBLEM: 'excited',
  ALL_PROBLEMS_FOUND: 'proud',
  STUDIO_OPEN: 'excited',
  TAP_MASCOT: 'playful',
  IDLE_WAIT: 'sleepy',
  CONFUSED: 'confused',
  WAVE_HELLO: 'waving',
  SURPRISE: 'surprised',
  RESET: 'idle'
};

const SPARK_EVENT_NAME = 'spark-game-event';

/**
 * Отправить игровое событие для маскота Спарка
 */
export function emitSparkEvent(event: SparkEvent, customDurationMs = 3000) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(SPARK_EVENT_NAME, {
      detail: {
        event,
        emotion: EVENT_TO_EMOTION[event],
        duration: customDurationMs
      }
    })
  );
}

/**
 * Хук для отслеживания текущей эмоции Спарка с автоматическим возвратом к базовой
 */
export function useSparkEmotion(baseEmotion: SparkEmotion = 'idle') {
  const [currentEmotion, setCurrentEmotion] = useState<SparkEmotion>(baseEmotion);

  useEffect(() => {
    setCurrentEmotion(baseEmotion);
  }, [baseEmotion]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handler = (e: Event) => {
      const custom = e as CustomEvent<{
        event: SparkEvent;
        emotion: SparkEmotion;
        duration: number;
      }>;
      if (custom.detail?.emotion) {
        setCurrentEmotion(custom.detail.emotion);

        if (timer) clearTimeout(timer);
        if (custom.detail.duration > 0 && custom.detail.emotion !== baseEmotion) {
          timer = setTimeout(() => {
            setCurrentEmotion(baseEmotion);
          }, custom.detail.duration);
        }
      }
    };

    window.addEventListener(SPARK_EVENT_NAME, handler);
    return () => {
      window.removeEventListener(SPARK_EVENT_NAME, handler);
      if (timer) clearTimeout(timer);
    };
  }, [baseEmotion]);

  return {
    emotion: currentEmotion,
    setEmotion: setCurrentEmotion,
    triggerEvent: emitSparkEvent
  };
}
