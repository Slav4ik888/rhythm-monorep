// packages/frontend/src/entities/hints/model/store.ts

import { create } from 'zustand';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import type { StateSchemaHints } from './state-schema';

const initialState: StateSchemaHints = {
  loading: false,
  errors: {},
  hintsQueue: [],
  shownHints: [],
  currentHintId: null,
};

interface HintsActions {
  // Аналог синхронных actions Redux-слайса
  setErrors: (errors: Errors) => void;
  clearErrors: () => void;
  shownNextHint: () => void;
  closeCurrentHint: () => void;
  addHintsToQueue: (hintIds: string[]) => void;

  // Асинхронные действия (заменяют extraReducers)
  // Устанавливает loading=true/errors={}
  startLoading: () => void;
  // Успешное завершение dontShowAgain: добавляет текущую подсказку в shownHints, показывает следующую
  finishDontShowAgain: (lastCurrentHintId: string) => void;
  // Ошибка dontShowAgain
  failDontShowAgain: (errors: Errors) => void;
}

export type HintsStore = StateSchemaHints & HintsActions;

export const useHintsStore = create<HintsStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors: getError(errors) }),
  clearErrors: () => set({ errors: {} }),

  shownNextHint: () =>
    set((state) => {
      const [nextHint, ...remainingQueue] = state.hintsQueue;

      // Если очередь пуста, скрываем текущую подсказку
      if (!nextHint) {
        return { currentHintId: null, hintsQueue: [] };
      }

      // Показываем следующую подсказку из очереди
      return { currentHintId: nextHint, hintsQueue: remainingQueue };
    }),

  closeCurrentHint: () =>
    set((state) => {
      // Добавляем текущую подсказку в показанные и показываем следующую
      const newShownHints = state.currentHintId ? [...state.shownHints, state.currentHintId] : state.shownHints;

      const [newCurrentHint, ...newQueue] = state.hintsQueue;

      return {
        shownHints: newShownHints,
        currentHintId: newCurrentHint || null,
        hintsQueue: newQueue,
      };
    }),

  addHintsToQueue: (hintIds) =>
    set((state) => {
      const newHints = hintIds.filter(
        (hintId) =>
          !state.shownHints.includes(hintId) && // Ещё не показывали
          !state.hintsQueue.includes(hintId) && // Нет в очереди (чтобы избежать повторы)
          state.currentHintId !== hintId, // Не текущий
      );

      // Если сейчас нет активной подсказки, сразу показываем первую из новых
      const shouldShowFirstHint = !state.currentHintId && newHints.length > 0;
      const [firstNewHint, ...otherNewHints] = newHints;

      return {
        currentHintId: shouldShowFirstHint ? firstNewHint : state.currentHintId,
        hintsQueue: shouldShowFirstHint ? [...state.hintsQueue, ...otherNewHints] : [...state.hintsQueue, ...newHints],
      };
    }),

  // Асинхронные действия
  startLoading: () => set({ loading: true, errors: {} }),

  finishDontShowAgain: (lastCurrentHintId) =>
    set((state) => {
      const lastId = lastCurrentHintId || state.currentHintId;
      const newShownHints = lastId ? [...state.shownHints, lastId] : state.shownHints;
      const [newCurrentHint, ...newQueue] = state.hintsQueue;

      return {
        shownHints: newShownHints,
        currentHintId: newCurrentHint || null,
        hintsQueue: newQueue,
        loading: false,
        errors: {},
      };
    }),

  failDontShowAgain: (errors) =>
    set({
      errors: getError(errors),
      loading: false,
    }),
}));
