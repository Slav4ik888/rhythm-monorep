import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dontShowAgain } from 'shared/api/features/hints';
import { StateSchemaHints } from './state-schema';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { LS } from 'shared/lib/local-storage';



const initialState: StateSchemaHints = {
  loading       : false,
  errors        : {},
  hintsQueue    : [],
  shownHints    : [],
  currentHintId : null,
};


export const slice = createSlice({
  name: 'entities/hints',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    shownNextHint: (state) => {
      const [nextHint, ...remainingQueue] = state.hintsQueue;

      // Если очередь пуста, скрываем текущую подсказку
      if (! nextHint) {
        state.currentHintId = null;
        state.hintsQueue    = [];
      }

      // Показываем следующую подсказку из очереди
      state.currentHintId = nextHint;
      state.hintsQueue    = remainingQueue;
    },
    closeCurrentHint: (state) => {
      // Добавляем текущую подсказку в показанные и показываем следующую
      const newShownHints = state.currentHintId
        ? [...state.shownHints, state.currentHintId]
        : state.shownHints;

      const [newCurrentHint, ...newQueue] = state.hintsQueue;

      state.shownHints    = newShownHints;
      state.currentHintId = newCurrentHint || null;
      state.hintsQueue    = newQueue;
    },
    addHintsToQueue: (state, { payload }: PayloadAction<string[]>) => {
      const newHints = payload.filter(hintId =>
        ! state.shownHints.includes(hintId)    // Ещё не показывали
        && ! state.hintsQueue.includes(hintId) // Нет в очереди (чтобы избежать повторы)
        && state.currentHintId !== hintId        // Не текущий
      );

      // Если сейчас нет активной подсказки, сразу показываем первую из новых
      const shouldShowFirstHint = ! state.currentHintId && newHints.length > 0;
      const [firstNewHint, ...otherNewHints] = newHints;

      state.currentHintId = shouldShowFirstHint ? firstNewHint : state.currentHintId;
      state.hintsQueue    = shouldShowFirstHint
        ? [...state.hintsQueue, ...otherNewHints]
        : [...state.hintsQueue, ...newHints];
    },
  },
   extraReducers: builder => {
    // DONT-SHOW-AGAIN
    builder
      .addCase(dontShowAgain.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(dontShowAgain.fulfilled, (state) => {
        // Добавляем текущую подсказку в показанные и показываем следующую
        const lastCurrentHintId = state.currentHintId;
        const newShownHints = lastCurrentHintId
          ? [...state.shownHints, lastCurrentHintId]
          : state.shownHints;

        const [newCurrentHint, ...newQueue] = state.hintsQueue;

        state.shownHints    = newShownHints;
        state.currentHintId = newCurrentHint || null;
        state.hintsQueue    = newQueue;
        state.loading       = false;
        state.errors        = {};

        LS.setHintsDontShowAgain(lastCurrentHintId as string);
      })
      .addCase(dontShowAgain.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
    }
})

export const { actions, reducer } = slice;
